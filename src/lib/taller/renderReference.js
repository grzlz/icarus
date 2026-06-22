import { fallbackBg, printColor, threadColor } from '$lib/shirt.js';

/*
 * Paints the deterministic shirt mockup to an offscreen canvas and returns a
 * PNG data URL. This is the EXACT-text reference handed to the image model:
 * the AI's job is only to make this photoreal (fabric, folds, light, scene),
 * NOT to render the phrase from scratch — which is where text-to-image garbles
 * code-y prints like `:wq` or `console.log(ñ)`.
 *
 * Mirrors the `.print` utility + ShirtMockup layout (mono 700, tight tracking,
 * lowercase, centered for estampado; small dashed patch for bordado).
 */
export async function renderReference({ phrase, garment, technique }, size = 1024) {
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
		drawBordado(ctx, lines, garment, size);
	} else {
		drawEstampado(ctx, lines, garment, size);
	}

	return canvas.toDataURL('image/png');
}

// Big centered chest print, auto-fit to the artwork area.
function drawEstampado(ctx, lines, garment, size) {
	const maxWidth = size * 0.82;
	const maxHeight = size * 0.72;
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
	const startY = size / 2 - (lines.length * lineH) / 2 + lineH / 2;
	lines.forEach((l, i) => ctx.fillText(l, size / 2, startY + i * lineH));
}

// Small embroidered patch, upper-left, dashed outline — mirrors the bordado card.
function drawBordado(ctx, lines, garment, size) {
	const thread = threadColor(garment);
	const fontPx = Math.round(size * 0.05);
	const lineHeight = 1.1;

	applyPrintFont(ctx, fontPx);
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';

	const padX = fontPx * 0.7;
	const padY = fontPx * 0.55;
	const widest = Math.max(...lines.map((l) => ctx.measureText(l).width), 1);
	const lineH = fontPx * lineHeight;
	const blockH = lines.length * lineH;

	const originX = size * 0.24;
	const originY = size * 0.26;

	ctx.save();
	ctx.globalAlpha = 0.45;
	ctx.strokeStyle = thread;
	ctx.lineWidth = Math.max(2, size * 0.0025);
	ctx.setLineDash([size * 0.012, size * 0.01]);
	ctx.beginPath();
	ctx.roundRect(originX - padX, originY - padY, widest + padX * 2, blockH + padY * 2, fontPx * 0.3);
	ctx.stroke();
	ctx.restore();

	ctx.fillStyle = thread;
	lines.forEach((l, i) => ctx.fillText(l, originX, originY + i * lineH));
}

function applyPrintFont(ctx, fontPx) {
	ctx.font = `700 ${fontPx}px "JetBrains Mono", ui-monospace, monospace`;
	// `.print` uses letter-spacing -0.02em; express it in px for canvas.
	ctx.letterSpacing = `${-0.02 * fontPx}px`;
}
