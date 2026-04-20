# Content Scripts

This folder contains the build-time BitLore content pipeline.

## Commands

- `npm run content:scan` — verifies category and legend discovery.
- `npm run content:scan:json` — prints the repository scan result as JSON.
- `npm run content:build` — parses the legend markdown and generates typed content modules in `src/content/generated/`.
- `npm run content:fix-links` — rewrites source `README.md` files so catalog people use canonical internal biography links and missing catalog matches fall back to Wikipedia.

## Current Output

The generator currently writes:

- `src/content/generated/categories.generated.ts`
- `src/content/generated/legend-index.generated.ts`
- `src/content/generated/legend-details.generated.ts`
- `src/content/generated/index.ts`

## Notes

- Source markdown outside `site/` remains untouched.
- `npm run content:fix-links` is the exception: it intentionally updates source markdown outside `site/` to keep catalog person links canonical.
- Relative portrait and legend image paths are copied into `site/public/images/legends/` during `npm run content:build` and emitted as first-party local asset URLs.
- Raster legend images now also get generated responsive WebP variants, and the homepage hero image gets generated WebP variants under `site/public/images/landing/hero/generated/`.
- Internal markdown links are normalized into site routes such as `/legend/:slug` and `/category/:slug`.