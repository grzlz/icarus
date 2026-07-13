// Batch product mockups: runs every catalog item through the /taller pipeline
// (exact-text canvas reference → GPT Image 1.5 edit), re-encodes to WebP via
// Chromium's canvas (the API's PNGs are ~1-2 MB; WebP lands ~20-100 KB), and
// saves static/shirts/<slug>.webp. Costs OpenAI credits per image — skips
// files that already exist so re-runs only fill gaps.
//
// Usage: node scripts/generate-shirt-images.mjs
//   BASE_URL=http://localhost:5188   dev server to render references against
//   QUALITY=rapido|calidad           image quality tier (default rapido)
//   FORCE=1                          regenerate even if the WebP exists
//   ONLY=bordado-wq,bordado-404      limit to specific slugs
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { products } from '../src/lib/products.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'static', 'shirts');
const baseUrl = process.env.BASE_URL ?? 'http://localhost:5188';
const quality = process.env.QUALITY ?? 'rapido';
const only = process.env.ONLY?.split(',').map((s) => s.trim());

// The generate endpoint is gated by TALLER_PASSWORD; read it straight from
// .env so the secret never travels beyond this machine.
const password = /^TALLER_PASSWORD=["']?(.*?)["']?$/m.exec(
	readFileSync(join(root, '.env'), 'utf8')
)?.[1];

let queue = products.filter((p) => (only ? only.includes(p.slug) : true));
if (!process.env.FORCE) {
	queue = queue.filter((p) => !existsSync(join(outDir, `${p.slug}.webp`)));
}
if (queue.length === 0) {
	console.log('nothing to do — all WebPs exist (FORCE=1 to regenerate)');
	process.exit(0);
}
console.log(`generating ${queue.length}/${products.length} mockups at quality=${quality}`);

// One browser page renders all references; the app's CSS loads JetBrains Mono
// so the canvas text matches the .print utility exactly.
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(baseUrl, { waitUntil: 'networkidle' });

let failed = 0;
for (const p of queue) {
	const label = `${p.slug} (${p.type.toLowerCase()} ${p.garment}, ${p.technique})`;
	try {
		const referenceImage = await page.evaluate(
			async (product) => {
				const { renderReference } = await import('/src/lib/taller/renderReference.js');
				return renderReference(product);
			},
			{ phrase: p.phrase, garment: p.garment, technique: p.technique }
		);

		const res = await fetch(`${baseUrl}/api/taller/generate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				referenceImage,
				garment: p.garment,
				technique: p.technique,
				type: p.type.toLowerCase(),
				scene: 'flatlay',
				quality,
				password
			})
		});
		const payload = await res.json();
		if (!res.ok || !payload.image) throw new Error(payload.error ?? `HTTP ${res.status}`);

		// Re-encode the API's hefty PNG to WebP inside the already-open page.
		const webpUrl = await page.evaluate(async (pngUrl) => {
			const img = new Image();
			img.src = pngUrl;
			await img.decode();
			const c = document.createElement('canvas');
			c.width = img.width;
			c.height = img.height;
			c.getContext('2d').drawImage(img, 0, 0);
			return c.toDataURL('image/webp', 0.82);
		}, payload.image);
		const b64 = webpUrl.replace(/^data:image\/webp;base64,/, '');
		writeFileSync(join(outDir, `${p.slug}.webp`), Buffer.from(b64, 'base64'));
		console.log(`✓ ${label}`);
	} catch (err) {
		failed++;
		console.error(`✗ ${label}: ${err.message}`);
	}
}

await browser.close();
console.log(failed ? `done with ${failed} failure(s) — re-run to retry` : 'done');
process.exit(failed ? 1 : 0);
