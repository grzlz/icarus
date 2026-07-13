// Visual verification: open the real dev server in a real browser and screenshot it.
// Usage: node scripts/screenshot.mjs [path] [out.png]
//   HEADLESS=1 node scripts/screenshot.mjs   → run without popping a window
import { chromium } from 'playwright';

const path = process.argv[2] ?? '/';
const out = process.argv[3] ?? 'screenshot.png';
const url = new URL(path, process.env.BASE_URL ?? 'http://localhost:5173').toString();

const browser = await chromium.launch({ headless: process.env.HEADLESS === '1' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });

// Scroll through the page so IntersectionObserver-based reveals (use:reveal) fire
await page.evaluate(async () => {
	for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
		window.scrollTo(0, y);
		await new Promise((r) => setTimeout(r, 150));
	}
	window.scrollTo(0, 0);
});
await page.waitForTimeout(500);

await page.screenshot({ path: out, fullPage: true });
await browser.close();

console.log(`saved ${out}`);
