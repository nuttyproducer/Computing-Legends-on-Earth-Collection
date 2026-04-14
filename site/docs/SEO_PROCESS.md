# SEO Upgrade Process

This document explains the SEO work implemented in the `site/` app, how it is wired today, and how to extend it safely in future upgrades.

## Quick Start

If you only need the high-level workflow, use this sequence:

1. Update shared defaults in `site/src/content/seo.ts`.
2. Extend shared tag behavior in `site/src/components/Seo.tsx` if needed.
3. Set route-specific metadata in the page component you are touching.
4. Add or refine structured data with fields already present in generated content.
5. Update `site/scripts/content/build-content.mjs` if sitemap or robots behavior changes.
6. Run `npm run lint` and `npm run build` inside `site/`.
7. Push the `website` branch to trigger the GitHub Pages workflow.

## Goals

The current SEO system is designed to improve:

- search engine crawlability
- route-level metadata quality
- social sharing previews
- structured data coverage
- build-time reliability for sitemap and robots assets

## Current SEO Architecture

### 1. Shared metadata component

File: `site/src/components/Seo.tsx`

This component is the central place for route-level metadata. It updates the browser `<head>` at runtime and manages:

- `title`
- `description`
- canonical URL
- `robots`
- Open Graph tags
- Twitter card tags
- JSON-LD structured data

It now supports:

- per-page `image`
- per-page `imageAlt`
- route-specific `type`
- optional `noIndex`
- single-object or array-based structured data payloads

### 2. Shared defaults

File: `site/src/content/seo.ts`

This file contains the canonical source for:

- `siteUrl`
- `siteName`
- default description
- default social preview image
- default image alt text
- locale

If the production URL ever changes, update it here first.

### 3. Route-level SEO ownership

SEO is defined inside each page component so metadata stays close to the page content:

- `site/src/pages/HomePage.tsx`
- `site/src/pages/CategoryPage.tsx`
- `site/src/pages/LegendPage.tsx`
- `site/src/pages/SearchPage.tsx`
- `site/src/pages/NotFoundPage.tsx`

This keeps titles, descriptions, images, and structured data aligned with the actual content rendered on the route.

## What Was Implemented

### Phase 1: baseline metadata

File: `site/index.html`

We replaced the placeholder document title and added default:

- title
- meta description
- canonical URL
- Open Graph tags
- Twitter tags

These defaults cover the initial HTML shell before route-level metadata takes over.

### Phase 2: route-level metadata

We added the `Seo` component to all core pages.

Each route now defines its own:

- title
- description
- canonical path
- social image
- structured data

### Phase 3: structured data

#### Home page

File: `site/src/pages/HomePage.tsx`

The home page now outputs:

- `WebSite`
- `CollectionPage`
- category `ItemList`
- featured legends `ItemList`
- `Dataset`
- `SearchAction`

This improves search engine understanding of the archive as a browsable collection.

#### Category pages

File: `site/src/pages/CategoryPage.tsx`

Category pages now output:

- `CollectionPage`
- `BreadcrumbList`
- legend `ItemList`

The category page also uses a category-specific social image when a legend portrait is available.

#### Legend pages

File: `site/src/pages/LegendPage.tsx`

Legend pages now output:

- `ProfilePage`
- `Person`
- `BreadcrumbList`

The `Person` schema is enriched with data already available in generated content, including:

- `sameAs` from resources and references
- `knowsAbout` from fields and tags
- `award`
- `hasOccupation`
- timeline-backed `subjectOf` events

Legend pages also use the legend portrait as the social preview image.

#### Search page

File: `site/src/pages/SearchPage.tsx`

The search page now outputs:

- `SearchResultsPage`
- `BreadcrumbList`

It remains `noindex`, but still has coherent structured data and social metadata.

### Phase 4: social preview quality

The shared SEO layer now sets:

- `og:image`
- `og:image:alt`
- `og:locale`
- `twitter:image`
- `twitter:image:alt`
- `twitter:url`

Per-route image strategy:

- Home: archive hero image
- Category: first legend portrait in the category when available
- Legend: legend portrait
- Search: first matching portrait when available, otherwise default hero image
- Not Found: default site image

## Crawl Asset Generation

### Sitemap

Generated file: `site/public/sitemap.xml`

Build source: `site/scripts/content/build-content.mjs`

The sitemap is generated automatically from content-derived routes:

- home page
- all category routes
- all legend routes

This avoids manual drift whenever legends or categories are added.

### Robots

Generated file: `site/public/robots.txt`

Build source: `site/scripts/content/build-content.mjs`

`robots.txt` is generated from the same base URL logic used for the sitemap. This ensures the sitemap URL stays correct if the site URL is updated in the build environment.

## Build Workflow

File: `site/package.json`

The build flow now includes:

- `prebuild`: `npm run content:build`
- `build`: `tsc -b && vite build`

This means a normal production build automatically refreshes:

- generated content files
- `sitemap.xml`
- `robots.txt`

## Validation Workflow

Use these commands inside `site/`:

```zsh
npm run lint
npm run build
```

Expected current behavior:

- lint succeeds with warnings only in generated files
- build succeeds

The warnings are currently from generated files that still include `/* eslint-disable */` banners even when no lint suppression is needed.

## Deployment Workflow

GitHub Pages deployment is handled by:

- `.github/workflows/deploy-website.yml`

Current behavior:

- any push to the `website` branch triggers the workflow
- the workflow runs `npm ci` and `npm run build` inside `site/`
- the built output from `site/dist` is uploaded to GitHub Pages

This means the normal release path is:

1. make and validate changes locally
2. commit on `website`
3. push `website`
4. let GitHub Actions publish the updated Pages site

## How To Upgrade Later

When doing the next SEO pass, follow this order:

1. Update canonical defaults in `site/src/content/seo.ts`.
2. Extend shared tag handling in `site/src/components/Seo.tsx`.
3. Add route-specific metadata in the relevant page component.
4. Add or refine structured data with real content fields already available.
5. If crawl assets need updates, change `site/scripts/content/build-content.mjs`.
6. Run lint and build.
7. Manually inspect page source or browser devtools for final metadata output.

## Recommended Future Improvements

### 1. Generated OG image cards

The biggest next step for social quality is to generate real page-specific social cards rather than reusing portraits and the hero image.

Suggested approach:

- create a small build script that renders branded OG images for home, categories, and legends
- output them to `site/public/images/social/`
- point route metadata to those generated image files

### 2. More complete social metadata

Possible additions:

- `twitter:creator` if a brand handle exists
- `article:section` or `article:tag` for content-like pages
- explicit image dimensions if generated OG cards have fixed sizes

### 3. Generated breadcrumb/schema helpers

If route-level schema grows more complex, factor repetitive JSON-LD creation into helper functions under `site/src/content/` or `site/src/lib/`.

### 4. Sitemap enhancements

Possible future additions:

- `lastmod` dates from content updates
- `changefreq`
- `priority`

### 5. Static prerendering or SSR

Because this is a client-rendered app, some crawlers may rely more heavily on JavaScript execution. If SEO needs become more demanding, consider prerendering or SSR so metadata exists directly in the initial HTML per route.

## Quick File Map

- `site/index.html`: default shell metadata
- `site/src/components/Seo.tsx`: shared runtime metadata manager
- `site/src/content/seo.ts`: canonical SEO defaults
- `site/src/pages/HomePage.tsx`: home SEO + collection schema
- `site/src/pages/CategoryPage.tsx`: category SEO + list schema
- `site/src/pages/LegendPage.tsx`: legend SEO + profile/person schema
- `site/src/pages/SearchPage.tsx`: search SEO + breadcrumb schema
- `site/src/pages/NotFoundPage.tsx`: noindex fallback route
- `site/scripts/content/build-content.mjs`: generated content + sitemap + robots
- `site/public/sitemap.xml`: generated sitemap output
- `site/public/robots.txt`: generated robots output

## Maintenance Rule of Thumb

If a route can be shared, indexed, or previewed, it should explicitly define:

- a strong title
- a specific description
- a canonical path
- a useful preview image
- appropriate structured data

That principle should guide all future SEO upgrades.

## Handoff Checklist

Before finishing an SEO upgrade, confirm all of the following:

- the page has a specific title and description
- the canonical path is correct
- the social preview image is intentional
- `imageAlt` text is set when using a custom preview image
- structured data matches the actual content on the page
- `robots.txt` and `sitemap.xml` still point at the correct site URL
- `npm run lint` passes without new errors
- `npm run build` succeeds
- the `website` branch is pushed so Pages can redeploy