import { fallbackBg, printColor, threadColor } from '$lib/shirt.js';
import { tintedWing } from '$lib/wing.js';

/*
 * Paints the deterministic shirt mockup to an offscreen canvas and returns a
 * PNG data URL. This is the EXACT-text reference handed to the image model:
 * the AI's job is only to make this photoreal (fabric, folds, light, scene),
 * NOT to render the phrase from scratch — which is where text-to-image garbles
 * code-y prints like `:wq` or `console.log(ñ)`.
 *
 * Mirrors the `.print` utility + ShirtMockup layout (mono 700, tight tracking,
 * lowercase, centered for estampado; small chest lettering for bordado).
 * `closeup` frames the bordado lettering large, as a chest-detail crop — the
 * catalog uses it so the embroidery stays legible at card size.
 */
export async function renderReference(
	{ phrase, garment, technique, closeup = false },
	size = 1024
) {
	// Make sure the screen-print font is loaded before we measure/draw, else the
	// reference falls back to a different monospace and widths drift.
	try {
		await document.fonts.load('700 48px "JetBrains Mono"');
		await document.fonts.ready;
	} catch {
		// Font Loading API unavailable — proceed with whatever monospace exists.
	}

	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d');

	ctx.fillStyle = fallbackBg(garment);
	ctx.fillRect(0, 0, size, size);

	const lines = String(phrase ?? '')
		.split('\n')
		.map((l) => l.toLowerCase());

	if (technique === 'bordado') {
		drawBordado(ctx, lines, garment, size, closeup);
	} else {
		drawEstampado(ctx, lines, garment, size);
		await drawWing(ctx, garment, size);
	}

	return canvas.toDataURL('image/png');
}

// Icarus wing on the wearer's-left chest — same placement as ShirtMockup
// (top 19%, right 21%, width 13%) so the generated photos keep the brand mark,
// tinted per garment so the model reproduces a color that actually reads.
async function drawWing(ctx, garment, size) {
	const wing = await tintedWing(garment);
	if (!wing) return; // logo unavailable — the reference still works without the mark
	const w = size * 0.13;
	const h = w * (wing.height / wing.width);
	ctx.drawImage(wing, size * (1 - 0.21 - 0.13), size * 0.19, w, h);
}

// Big centered chest print, auto-fit to the artwork area. Height is capped
// and the block top clamped so tall phrases never climb into the wing zone
// (~19–26% height on the wearer's-left chest) — "deploys los viernes" once
// generated with the wing fused into the 'y'.
function drawEstampado(ctx, lines, garment, size) {
	const maxWidth = size * 0.82;
	const maxHeight = size * 0.58;
	const lineHeight = 1.05;

	let fontPx = Math.floor(maxHeight);
	for (; fontPx > 6; fontPx -= 2) {
		applyPrintFont(ctx, fontPx);
		const widest = Math.max(...lines.map((l) => ctx.measureText(l).width), 0);
		const totalH = lines.length * fontPx * lineHeight;
		if (widest <= maxWidth && totalH <= maxHeight) break;
	}

	applyPrintFont(ctx, fontPx);
	ctx.fillStyle = printColor(garment);
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	const lineH = fontPx * lineHeight;
	const blockH = lines.length * lineH;
	const top = Math.max(size * 0.3, size / 2 - blockH / 2);
	lines.forEach((l, i) => ctx.fillText(l, size / 2, top + lineH / 2 + i * lineH));
}

// Embroidered lettering only — never draw an outline here: the image model
// reproduces the reference literally, so a dashed box ends up stitched into
// the "photo". (That's exactly what happened to the first catalog batch.)
function drawBordado(ctx, lines, garment, size, closeup) {
	const thread = threadColor(garment);
	ctx.fillStyle = thread;

	if (closeup) {
		// Chest-detail crop: lettering large and centered, auto-fit.
		const maxWidth = size * 0.55;
		const maxHeight = size * 0.26;
		const lineHeight = 1.15;

		let fontPx = Math.floor(maxHeight);
		for (; fontPx > 6; fontPx -= 2) {
			applyPrintFont(ctx, fontPx);
			const widest = Math.max(...lines.map((l) => ctx.measureText(l).width), 0);
			if (widest <= maxWidth && lines.length * fontPx * lineHeight <= maxHeight) break;
		}

		applyPrintFont(ctx, fontPx);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		const lineH = fontPx * lineHeight;
		const startY = size / 2 - (lines.length * lineH) / 2 + lineH / 2;
		lines.forEach((l, i) => ctx.fillText(l, size / 2, startY + i * lineH));
		return;
	}

	// Full-garment view (/taller): small lettering at the upper-left chest.
	const fontPx = Math.round(size * 0.05);
	const lineH = fontPx * 1.1;
	applyPrintFont(ctx, fontPx);
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	lines.forEach((l, i) => ctx.fillText(l, size * 0.24, size * 0.26 + i * lineH));
}

function applyPrintFont(ctx, fontPx) {
	ctx.font = `700 ${fontPx}px "JetBrains Mono", ui-monospace, monospace`;
	// `.print` uses letter-spacing -0.02em; express it in px for canvas.
	ctx.letterSpacing = `${-0.02 * fontPx}px`;
}
