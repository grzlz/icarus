import { logoColor } from './shirt.js';

/*
 * The Icarus wing tinted for a garment (see logoColor in shirt.js). Client-only:
 * shared by the /taller reference painter and the 3D scene's wing decal so both
 * surfaces recolor the mark the same way. The PNG is a flat single-color mark
 * with alpha, so source-in flooding recolors it without losing the soft edges.
 */

let wingImage;

function loadWing() {
	if (!wingImage) {
		const img = new Image();
		img.src = '/logo.png';
		wingImage = img.decode().then(() => img);
	}
	return wingImage;
}

// Resolves to a canvas with the tinted wing, or null when the logo asset is
// unavailable — callers just skip the mark in that case.
export async function tintedWing(garment) {
	let img;
	try {
		img = await loadWing();
	} catch {
		return null;
	}
	const canvas = document.createElement('canvas');
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);
	ctx.globalCompositeOperation = 'source-in';
	ctx.fillStyle = logoColor(garment);
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	return canvas;
}
