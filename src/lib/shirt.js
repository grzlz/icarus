/*
 * Garment → simulated-fabric values. Single source of truth shared by
 * ShirtMockup.svelte (DOM card), the /taller canvas painter (reference image),
 * and the /taller controls. The colors mirror the `.print` look so what the
 * tool sends to the image model matches what the catalog shows.
 */

export const garments = [
	{ id: 'black', label: 'negra' },
	{ id: 'white', label: 'blanca' },
	{ id: 'grey', label: 'gris' },
	{ id: 'olive', label: 'olivo' }
];

export const techniques = [
	{ id: 'estampado', label: 'Estampado' },
	{ id: 'bordado', label: 'Bordado' }
];

export function isLight(g) {
	return g === 'white' || g === 'grey';
}

export function fallbackBg(g) {
	if (g === 'white') return 'oklch(0.96 0.008 75)';
	if (g === 'grey') return 'oklch(0.62 0.008 270)';
	if (g === 'olive') return 'oklch(0.4 0.05 115)';
	return 'oklch(0.16 0.012 250)';
}

export function printColor(g) {
	return isLight(g) ? 'oklch(0.16 0.012 250)' : 'oklch(0.96 0.008 75)';
}

export function threadColor(g) {
	return g === 'olive' || !isLight(g) ? 'oklch(0.92 0.08 95)' : 'oklch(0.16 0.012 250)';
}

export function garmentLabel(g) {
	return garments.find((x) => x.id === g)?.label ?? 'negra';
}
