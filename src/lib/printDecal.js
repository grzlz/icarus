import { printColor, threadColor } from '$lib/shirt.js';

/*
 * Paints the phrase to a transparent canvas for use as a decal texture on the
 * 3D shirt (ShirtScene.svelte). Same look as `.print` and the /taller
 * reference painter — JetBrains Mono 700, tight tracking, lowercase — but with
 * no background: the decal projects onto the mesh and the fabric shows through
 * the transparent pixels.
 *
 * Both techniques draw centered filling the canvas; the 3D scene decides final
 * size and chest placement via the decal's scale/position, not the texture.
 */
export async function paintDecal({ phrase, garment, technique }, size = 1024) {
	try {
		await document.fonts.load('700 48px "JetBrains Mono"');
		await document.fonts.ready;
	} catch {
		// Font Loading API unavailable — draw with the fallback monospace.
	}

	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d');

	const lines = String(phrase ?? '')
		.split('\n')
		.map((l) => l.toLowerCase());

	if (technique === 'bordado') {
		drawPatch(ctx, lines, garment, size);
	} else {
		drawPrint(ctx, lines, garment, size);
	}

	return canvas;
}

// Shrink until the longest line and the line stack both fit the box.
function fitFont(ctx, lines, maxWidth, maxHeight, lineHeight) {
	let fontPx = Math.floor(maxHeight);
	for (; fontPx > 6; fontPx -= 2) {
		applyPrintFont(ctx, fontPx);
		const widest = Math.max(...lines.map((l) => ctx.measureText(l).width), 0);
		if (widest <= maxWidth && lines.length * fontPx * lineHeight <= maxHeight) break;
	}
	return fontPx;
}

// Big screen-print: ink color per garment, centered.
function drawPrint(ctx, lines, garment, size) {
	const lineHeight = 1.05;
	const fontPx = fitFont(ctx, lines, size * 0.94, size * 0.88, lineHeight);

	applyPrintFont(ctx, fontPx);
	ctx.fillStyle = printColor(garment);
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	const lineH = fontPx * lineHeight;
	const startY = size / 2 - (lines.length * lineH) / 2 + lineH / 2;
	lines.forEach((l, i) => ctx.fillText(l, size / 2, startY + i * lineH));
}

// Embroidered patch: thread-colored text inside a dashed rounded outline,
// mirroring the bordado card in ShirtMockup.
function drawPatch(ctx, lines, garment, size) {
	const thread = threadColor(garment);
	const lineHeight = 1.1;
	const fontPx = fitFont(ctx, lines, size * 0.62, size * 0.5, lineHeight);

	applyPrintFont(ctx, fontPx);
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	const widest = Math.max(...lines.map((l) => ctx.measureText(l).width), 1);
	const lineH = fontPx * lineHeight;
	const blockH = lines.length * lineH;
	const padX = fontPx * 0.7;
	const padY = fontPx * 0.55;

	ctx.save();
	ctx.globalAlpha = 0.45;
	ctx.strokeStyle = thread;
	ctx.lineWidth = Math.max(2, size * 0.006);
	ctx.setLineDash([size * 0.03, size * 0.025]);
	ctx.beginPath();
	ctx.roundRect(
		size / 2 - widest / 2 - padX,
		size / 2 - blockH / 2 - padY,
		widest + padX * 2,
		blockH + padY * 2,
		fontPx * 0.3
	);
	ctx.stroke();
	ctx.restore();

	ctx.fillStyle = thread;
	const startY = size / 2 - blockH / 2 + lineH / 2;
	lines.forEach((l, i) => ctx.fillText(l, size / 2, startY + i * lineH));
}

function applyPrintFont(ctx, fontPx) {
	ctx.font = `700 ${fontPx}px "JetBrains Mono", ui-monospace, monospace`;
	// `.print` uses letter-spacing -0.02em; express it in px for canvas.
	ctx.letterSpacing = `${-0.02 * fontPx}px`;
}
