# 3D models

Wiring lives in `src/lib/models3d.js`; the scene that renders them is
`src/lib/components/ShirtScene.svelte`. The phrase is projected onto the
chest as a decal — see `src/lib/printDecal.js`.

## shirt.glb (Playera)

~1 MB — t-shirt mesh (`T_Shirt_male`, material `lambert1`, baked AO/normal
maps). CC0 model from the pmndrs market (https://market.pmnd.rs), the same
tee used by the classic Three.js shirt-configurator demos.

## sudadera.glb (Sudadera)

~0.7 MB — pullover hoodie, single mesh (`test_lambert1_0`), untextured
neutral material so the viewer's per-garment tint lands cleanly.

**Attribution (CC BY 4.0):** "hoodie" by **pokoponmaru** —
https://sketchfab.com/3d-models/hoodie-5ffe31a324a6452c8c4ada71daa12da9
Modified: node transforms baked, parts merged into one mesh, original
material/UVs replaced with a neutral tintable one. The site credit lives
in `TiendaVista3D.svelte` (shown when a sudadera is selected).

Sketchfab downloads now require an Epic Games account, so the file was
pulled from the **Objaverse** mirror (AllenAI's research dataset of
CC-licensed Sketchfab models, same UID, no account needed):
`https://huggingface.co/datasets/allenai/objaverse` →
`glbs/000-084/5ffe31a324a6452c8c4ada71daa12da9.glb`.

Prep steps (with `@gltf-transform/core` + `@gltf-transform/functions`):
`flatten()` + `dedup()` → assign one neutral doubleSided material
(white, roughness 1, metallic 0) to every primitive → strip all vertex
attributes except POSITION/NORMAL → `join()` → `prune()`.

## Swapping in a different garment asset later

- A single garment-only mesh (no body/avatar parts) joins cleanest; the
  scene falls back to the first mesh it finds if `node` doesn't match.
- Any size — it's auto-fitted (scaled + centered) at load via `fit` in
  models3d.js. Node transforms are ignored, so bake them into the
  vertices first (`flatten`).
- Prefer an untextured / neutral material: the viewer tints
  `material.color` per garment (black/white/grey/olive), and a strong
  baseColorTexture will fight the tint.
- Recalibrate the decal transforms in models3d.js (`print/patch/logo`)
  against the new mesh — use `npm run screenshot` to iterate.
- To search Objaverse for CC garments: grep its metadata shards for the
  garment name, check `license` is `by`/`by-sa` (not `-nc`), and verify
  the author via the Sketchfab API for the credit line.
