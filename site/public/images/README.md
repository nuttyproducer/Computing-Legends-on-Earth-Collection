# Image Asset Structure

This folder holds static website images for the `site/` app.

## Folder Layout

- `landing/hero/` — homepage hero images and editorial cover imagery
- `landing/featured/` — featured legend cards used on the landing page
- `shared/textures/` — reusable grain, diagram, or decorative museum textures

## Naming Convention

Use lowercase kebab-case filenames.

Examples:
- `landing/hero/hero-vacuum-tubes-editorial.jpg`
- `landing/featured/ada-lovelace-feature.jpg`
- `landing/featured/alan-turing-feature.jpg`
- `landing/featured/geoffrey-hinton-feature.jpg`
- `shared/textures/archival-grain-overlay.png`

## Format Guidance

- Use `.jpg` for photographic imagery
- Use `.png` only when transparency is required
- Use `.webp` later if we want an optimized export pass
- Keep original exports outside the app if possible; place only production-ready assets here

## Rule of Thumb

- UI-specific imagery belongs in `site/public/images/`
- Structured legend content and source portraits should eventually be normalized through the website content pipeline rather than scattered ad hoc in components
