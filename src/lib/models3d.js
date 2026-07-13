/*
 * Catalog `type` (products.js) → 3D model wiring for the shirt viewer.
 * ShirtScene.svelte reads everything from here, so a new garment type is
 * one entry + one GLB in /static/models (see static/models/README.md).
 *
 * Decal transforms are in the rendered mesh's local space. For fitted
 * models (`fit` set) they're in post-fit units — the mesh is auto-scaled
 * so its height equals `fit` and centered at the origin, which is why the
 * tee's numbers keep working as reference for any new asset.
 */

export const MODELS = {
	Playera: {
		url: '/models/shirt.glb',
		node: 'T_Shirt_male',
		fit: null, // mesh is already ~0.61 units tall, centered — render as-is
		print: { position: [0, 0.04, 0.12], scale: [0.3, 0.3, 0.15] },
		patch: { position: [-0.08, 0.1, 0.12], scale: [0.14, 0.14, 0.12] },
		logo: { position: [0.1, 0.14, 0.12], scale: [0.075, 0.075, 0.1] }
	},
	Sudadera: {
		url: '/models/sudadera.glb',
		node: null, // asset not picked yet — scene uses the first mesh it finds
		fit: 0.65,
		print: { position: [0, 0.02, 0.16], scale: [0.28, 0.28, 0.2] },
		patch: { position: [-0.08, 0.08, 0.16], scale: [0.13, 0.13, 0.15] },
		logo: { position: [0.09, 0.12, 0.16], scale: [0.07, 0.07, 0.12] }
	}
};

export function modelFor(type) {
	return MODELS[type] ?? MODELS.Playera;
}

// The sudadera GLB may not be deployed yet. Probe once per session; while
// it's missing the viewer falls back to the tee ("vista previa en playera").
// Delete this (and its call sites) once the asset is a permanent part of
// the repo, if you want one less request.
let probe;
export function sudaderaAvailable() {
	probe ??= fetch(MODELS.Sudadera.url, { method: 'HEAD' })
		.then((r) => r.ok && !(r.headers.get('content-type') ?? '').includes('text/html'))
		.catch(() => false);
	return probe;
}
