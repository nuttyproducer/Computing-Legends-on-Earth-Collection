# Content Scripts

This folder contains the build-time BitLore content pipeline.

## Commands

- `npm run content:scan` — verifies category and legend discovery.
- `npm run content:scan:json` — prints the repository scan result as JSON.
- `npm run content:build` — parses the legend markdown and generates typed content modules in `src/content/generated/`.

## Current Output

The generator currently writes:

- `src/content/generated/categories.generated.ts`
- `src/content/generated/legend-index.generated.ts`
- `src/content/generated/legend-details.generated.ts`
- `src/content/generated/index.ts`

## Notes

- Source markdown outside `site/` remains untouched.
- Relative portrait paths are resolved to raw GitHub URLs on the `website` branch for now.
- Internal markdown links are normalized into site routes such as `/legend/:slug` and `/category/:slug`.