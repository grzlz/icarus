# Shirt mockup images

One WebP per product, named `<slug>.webp` after the `slug` in
`src/lib/products.js`. These are **finished product photos** — the print is
already on the shirt — so `<ShirtMockup>` shows them as-is (no phrase overlay).

Batch-generate them through the /taller pipeline (exact-text reference →
GPT Image 1.5 edit; needs the dev server running and `OPENAI_API_KEY` +
`TALLER_PASSWORD` in `.env`):

```bash
node scripts/generate-shirt-images.mjs              # fills missing PNGs (rapido)
QUALITY=calidad ONLY=bordado-wq FORCE=1 \
  node scripts/generate-shirt-images.mjs            # redo one at high quality
```

Each run costs OpenAI credits per generated image; existing files are skipped
unless `FORCE=1`. The script re-encodes the API's ~1-2 MB PNGs to WebP
(~20-100 KB) before saving — don't commit raw PNGs here.

Catalog photo conventions (all baked into the pipeline prompts):

- **One backdrop for everything** — warm off-white `#F4F1EA` (≈ bone-100),
  soft product shadow. The grid must look shot in a single session, and the
  light tiles read as intentional "product wells" in dark mode.
- **Estampado** — full flat-lay, phrase across the chest, the Icarus wing
  small on the wearer's-left chest (the reference render includes it).
- **Bordado** — close-up detail of the chest so the embroidery is legible at
  card size. No boxes or outlines around the lettering: anything drawn in the
  reference gets stitched into the "photo" literally (the first batch shipped
  with dashed placeholder borders embroidered on).

Real photography can replace any file later — keep the same square crop
(1:1, ~1024×1024), same backdrop, print readable. A product with no image
file (set `image: null` in `products.js`) falls back to the colored
placeholder card.
