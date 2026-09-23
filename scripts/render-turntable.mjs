// Pre-rendered 3D turntables: paints each piece's print + wing with the site's
// own painters (printDecal.js / wing.js, so the JetBrains Mono print matches),
// renders a full spin headless in Blender (scripts/turntable.py, Cycles on CPU),
// then encodes a looping MP4 + WebP poster to static/turntables/<slug>.*.
// Like the mockup photos, the bone studio background is baked in.
// Slow — about a minute of CPU per frame-second; skips pieces already rendered.
//
// Usage: node scripts/render-turntable.mjs
//   BASE_URL=http://localhost:5188   dev server to paint textures against
//   BLENDER=blender  FFMPEG=ffmpeg   binaries (default: on PATH)
//   ONLY=estampado-gpi-a-un-gpu      limit to specific slugs
//   FORCE=1                          re-render even if the MP4 exists
//   FRAMES=288                       frames per turn (24 fps → 12 s loop)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { products } from '../src/lib/products.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'static', 'turntables');
const baseUrl = process.env.BASE_URL ?? 'http://localhost:5188';
const blender = process.env.BLENDER ?? 'blender';
const ffmpeg = process.env.FFMPEG ?? 'ffmpeg';
const frames = process.env.FRAMES ?? '288';
const only = process.env.ONLY?.split(',').map((s) => s.trim());

// bone-100 (light) as sRGB — the same studio background as the mockup photos.
const BONE = '0xF7F3EC';
// Garments turntable.py has a model + decal boxes for.
const SUPPORTED = ['Playera'];

let queue = products.filter((p) => (only ? only.includes(p.slug) : true));
queue = queue.filter((p) => {
	if (SUPPORTED.includes(p.type)) return true;
	console.log(`skip ${p.slug}: no turntable model for ${p.type} yet`);
	return false;
});
if (!process.env.FORCE) {
	queue = queue.filter((p) => !existsSync(join(outDir, `${p.slug}.mp4`)));
}
if (queue.length === 0) {
	console.log('nothing to do — all turntables exist (FORCE=1 to re-render)');
	process.exit(0);
}
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(baseUrl, { waitUntil: 'networkidle' });

for (const p of queue) {
	const work = mkdtempSync(join(tmpdir(), `turntable-${p.slug}-`));
	const t0 = Date.now();
	try {
		const painted = await page.evaluate(
			async (product) => {
				const { paintDecal } = await import('/src/lib/printDecal.js');
				const { tintedWing } = await import('/src/lib/wing.js');
				const { fallbackBg } = await import('/src/lib/shirt.js');
				// fallbackBg speaks oklch; paint 1px and read back sRGB for Blender.
				const ctx = document.createElement('canvas').getContext('2d');
				ctx.canvas.width = ctx.canvas.height = 1;
				ctx.fillStyle = fallbackBg(product.garment);
				ctx.fillRect(0, 0, 1, 1);
				const print = await paintDecal(product, 2048);
				const wing = await tintedWing(product.garment);
				return {
					print: print.toDataURL(),
					wing: wing?.toDataURL() ?? null,
					fabric: [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)].join(',')
				};
			},
			{ phrase: p.phrase, garment: p.garment, technique: p.technique }
		);

		const png = (name, dataUrl) => {
			const file = join(work, `${name}.png`);
			writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
			return file;
		};
		const framesDir = join(work, 'frames');
		mkdirSync(framesDir);

		console.log(`rendering ${p.slug} (${frames} frames)…`);
		execFileSync(
			blender,
			[
				'-b',
				'-P',
				join(root, 'scripts', 'turntable.py'),
				'--',
				'--type',
				p.type,
				'--technique',
				p.technique,
				'--print',
				png('print', painted.print),
				'--wing',
				png('wing', painted.wing),
				'--fabric',
				painted.fabric,
				'--frames',
				frames,
				'--out',
				framesDir
			],
			{ stdio: ['ignore', 'ignore', 'inherit'] }
		);

		// Composite the transparent frames onto bone; faststart so it plays
		// before the whole file arrives.
		const bg = ['-f', 'lavfi', '-i', `color=${BONE}:s=720x720:r=24`];
		const frameInput = ['-framerate', '24', '-i', join(framesDir, 'f_%04d.png')];
		execFileSync(ffmpeg, [
			'-loglevel',
			'error',
			'-y',
			...bg,
			...frameInput,
			'-filter_complex',
			'[0][1]overlay=shortest=1',
			'-c:v',
			'libx264',
			'-preset',
			'slow',
			'-crf',
			'24',
			'-pix_fmt',
			'yuv420p',
			'-movflags',
			'+faststart',
			'-an',
			join(outDir, `${p.slug}.mp4`)
		]);
		execFileSync(ffmpeg, [
			'-loglevel',
			'error',
			'-y',
			...bg,
			...frameInput,
			'-filter_complex',
			'[0][1]overlay',
			'-frames:v',
			'1',
			'-quality',
			'85',
			join(outDir, `${p.slug}.webp`)
		]);
		console.log(`ok ${p.slug} in ${Math.round((Date.now() - t0) / 60000)} min`);
	} catch (err) {
		console.error(`failed ${p.slug}: ${err.message}`);
		process.exitCode = 1;
	} finally {
		rmSync(work, { recursive: true, force: true });
	}
}

await browser.close();
