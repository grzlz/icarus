# 3D models

- `shirt.glb` (~1 MB) — t-shirt mesh (`T_Shirt_male`, material `lambert1`,
  baked AO/normal maps). CC0 model from the pmndrs market
  (https://market.pmnd.rs), the same tee used by the classic Three.js
  shirt-configurator demos.

Used by `src/lib/components/ShirtScene.svelte` via Threlte's `useGltf`.
The phrase is projected onto the chest as a decal — see `src/lib/printDecal.js`.
