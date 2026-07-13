# 3D models

Wiring lives in `src/lib/models3d.js`; the scene that renders them is
`src/lib/components/ShirtScene.svelte`. The phrase is projected onto the
chest as a decal — see `src/lib/printDecal.js`.

## shirt.glb (Playera)

~1 MB — t-shirt mesh (`T_Shirt_male`, material `lambert1`, baked AO/normal
maps). CC0 model from the pmndrs market (https://market.pmnd.rs), the same
tee used by the classic Three.js shirt-configurator demos.

## sudadera.glb (Sudadera) — NOT COMMITTED YET

Until this file exists, sudadera products render on the tee with a
"vista previa en playera" notice (`sudaderaAvailable()` in models3d.js
probes for it at runtime, so dropping the file in is the only step).

What the file should be:

- A single garment-only mesh (no body/avatar parts). The scene grabs the
  first mesh it finds, so node names don't matter.
- Any size — it's auto-fitted (scaled + centered) at load. Node transforms
  are ignored, so bake them into the vertices first if the export has any:
  `npx @gltf-transform/cli flatten in.glb out.glb`
- Prefer an untextured / neutral material: the viewer tints
  `material.color` per garment (black/white/grey/olive), and a strong
  baseColorTexture will fight the tint.
- Decal placement guesses in models3d.js (`Sudadera.print/patch/logo`)
  will need calibrating against the real mesh — use
  `npm run screenshot` to iterate.

Shortlisted candidates (Sketchfab, free account needed to download, all
CC Attribution — credit the author here and on the site if used):

- Basic sweatshirt — Alexander Kurmanin, 20k faces (crewneck, matches the
  catalog photos): https://sketchfab.com/3d-models/basic-sweatshirt-92800a4c11ce4b8daccb75e60035535f
- Hoodie — Pieter Ferreira, 26k faces: https://sketchfab.com/3d-models/hoodie-6dca9cd855a8441881f0b324236cf325
- Long Hoodie — dejan31, 53k faces: https://sketchfab.com/3d-models/long-hoodie-f201f4c2e0c84d2c9806aaaeb0910abe

Download as glTF, convert/rename to `sudadera.glb`, drop it here.
