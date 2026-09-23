// Pre-rendered 3D turntables: paints each piece's print + wing with the site's
// own painters (printDecal.js / wing.js, so the JetBrains Mono print matches),
// renders a full spin headless in Blender (scripts/turntable.py, Cycles on CPU),
// then encodes a looping MP4 + WebP poster per theme to
// static/turntables/<slug>[-dark].* with the page background baked in, so the
// garment floats on the page (Turntable.svelte picks the variant).
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

// Page background (bone-50) per theme. The WebP poster gets it exactly; the
// MP4 gets a color measured to decode back to it in Chromium (H.264 in
// limited range lands a level or two off; dark stays ~1 off, which
// Turntable.svelte's edge feather hides).
const THEMES = [
	{ suffix: '', poster: '0xFCFAF6', video: '0xFEFCF8' },
	{ suffix: '-dark', poster: '0x0B1015', video: '0x0D1217' }
];
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

		// Composite the transparent frames onto each theme's page color; tagged
		// bt709 so browsers decode it predictably, faststart so it plays before
		// the whole file arrives.
		const frameInput = ['-framerate', '24', '-i', join(framesDir, 'f_%04d.png')];
		const bg = (color) => ['-f', 'lavfi', '-i', `color=${color}:s=720x720:r=24`];
		for (const theme of THEMES) {
			const name = `${p.slug}${theme.suffix}`;
			execFileSync(ffmpeg, [
				...['-loglevel', 'error', '-y', ...bg(theme.video), ...frameInput],
				'-filter_complex',
				'[0][1]overlay=shortest=1,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
				...['-c:v', 'libx264', '-preset', 'slow', '-crf', '24'],
				...['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709'],
				...['-color_range', 'tv', '-movflags', '+faststart', '-an'],
				join(outDir, `${name}.mp4`)
			]);
			execFileSync(ffmpeg, [
				...['-loglevel', 'error', '-y', ...bg(theme.poster), ...frameInput],
				...['-filter_complex', '[0][1]overlay', '-frames:v', '1', '-quality', '85'],
				join(outDir, `${name}.webp`)
			]);
		}
		console.log(`ok ${p.slug} in ${Math.round((Date.now() - t0) / 60000)} min`);
	} catch (err) {
		console.error(`failed ${p.slug}: ${err.message}`);
		process.exitCode = 1;
	} finally {
		rmSync(work, { recursive: true, force: true });
	}
}

await browser.close();
