# Shirt mockup photos

Drop flat-lay PNGs here. Recommended: square crop (1:1), neutral background,
shirt centered, no model, well-lit, ~1200×1200.

To use a photo on a product, set `image: '/shirts/your-file.png'` in the
product object on `/` or `/tienda`. Without `image`, the card falls back to
the colored placeholder block.

The `<ShirtMockup>` component overlays the phrase on top of the photo with
`mix-blend-mode: multiply` (white/grey shirts) or `screen` (black/olive),
so the print soaks into the fabric texture.

Suggested filenames (just a convention, not enforced):

- `playera-black.png`
- `playera-white.png`
- `playera-grey.png`
- `playera-olive.png`
- `sudadera-black.png`
- `sudadera-grey.png`
- `sudadera-olive.png`