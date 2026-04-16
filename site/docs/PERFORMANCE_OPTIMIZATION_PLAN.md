# Performance Optimization Plan

This document records the main performance improvements available for the `site/` app based on the current Lighthouse mobile audit, the current Vite/React architecture, and the generated content pipeline.

It is meant to serve as a working backlog before implementation begins.

## Current Performance Snapshot

The current mobile Lighthouse run highlights four dominant issues:

1. large image payloads
2. slow Largest Contentful Paint (LCP)
3. render-blocking font delivery
4. avoidable JavaScript work on first load

Most of the performance loss is currently coming from image delivery, not from server response time.

## Prioritization Model

Use this order when implementing improvements:

1. **Highest impact, low risk**
2. **Highest impact, moderate implementation work**
3. **Bundle and interaction refinements**
4. **Hosting and long-tail improvements**

---

## 1. Hero LCP Optimizations

These changes target the homepage hero image, which is currently the LCP element.

### 1.1 Preload the hero image

**Why:** Lighthouse reports that the LCP image is not discoverable early enough.

**Current code:**

- `site/index.html`
- `site/src/pages/HomePage.tsx`

**Optimizations:**

- add `<link rel="preload" as="image">` for the hero image in `site/index.html`
- add `fetchpriority="high"` to the hero `<img>`
- keep the hero image eager-loaded
- ensure the browser can discover the hero image before React finishes booting

### 1.2 Reduce hero image weight

**Why:** the homepage hero image is too large for mobile delivery.

**Current code/assets:**

- `site/src/pages/HomePage.tsx`
- `site/public/images/landing/hero/hero-digital-age-archive.jpg`

**Optimizations:**

- generate a smaller mobile-specific hero asset
- convert the hero image to WebP and/or AVIF
- keep a JPEG fallback only if needed
- serve a responsive image via `srcset` and `sizes`
- avoid using a desktop-grade hero image for small screens

### 1.3 Avoid redundant hero downloads

**Why:** the audit shows the hero image requested more than once.

**Optimizations:**

- verify preload URL exactly matches the rendered `<img>` URL
- avoid duplicate discovery paths with mismatched absolute vs relative URLs
- confirm the final built markup does not cause preload misses

---

## 2. Portrait and Card Image Optimizations

This is the biggest overall performance opportunity.

### 2.1 Stop serving portraits from `raw.githubusercontent.com`

**Why:** raw GitHub image URLs are large, not optimized for the UI, and have weak cache behavior.

**Current code:**

- `site/scripts/content/build-content.mjs`
- generated files under `site/src/content/generated/`
- `site/scripts/content/README.md`

**Optimizations:**

- copy portraits into a site-controlled static path during content build
- emit local image URLs under `site/public/images/` or another generated public directory
- stop shipping UI images from GitHub raw endpoints
- make all site image delivery first-party where possible

### 2.2 Generate responsive portrait variants

**Why:** portrait cards currently load full-resolution images even when rendered in small card frames.

**Current rendering points:**

- `site/src/pages/HomePage.tsx`
- `site/src/pages/CategoryPage.tsx`
- `site/src/pages/SearchPage.tsx`
- `site/src/pages/LegendPage.tsx`

**Optimizations:**

- generate small, medium, and large portrait variants during `content:build`
- add `srcset` and `sizes` for cards and detail pages
- use small thumbnails for grid/card layouts
- reserve larger images for legend detail routes only

### 2.3 Convert portraits to modern formats

**Why:** Lighthouse flags large savings from WebP/AVIF.

**Optimizations:**

- generate WebP versions for portraits and hero assets
- optionally generate AVIF for the highest-traffic images
- keep original JPEGs only as fallback
- prefer modern formats on cards and listings

### 2.4 Lazy-load offscreen images

**Why:** below-the-fold images are being loaded too early.

**Current code:**

- `site/src/pages/HomePage.tsx`
- `site/src/pages/CategoryPage.tsx`
- `site/src/pages/SearchPage.tsx`

**Optimizations:**

- add `loading="lazy"` to non-critical portraits
- add `decoding="async"` to card images
- keep only above-the-fold, user-visible images eager
- treat first viewport imagery separately from the rest of the page

### 2.5 Tune image dimensions and cropping

**Why:** some images may still ship more pixels than the UI needs.

**Optimizations:**

- generate card crops at the exact aspect ratio used by `.portrait-image`
- avoid loading tall archival originals into small fixed card frames
- preserve high-resolution originals only for detail pages or download use cases

---

## 3. Font Delivery Optimizations

Google Fonts are currently on the critical rendering path.

### 3.1 Remove CSS `@import` for fonts

**Why:** `@import` in CSS delays font discovery and is render-blocking.

**Current code:**

- `site/src/index.css`

**Optimizations:**

- remove the Google Fonts `@import`
- move font loading into `site/index.html`
- use `<link rel="preconnect">` and `<link rel="stylesheet">` instead

### 3.2 Self-host font files

**Why:** this reduces third-party dependency overhead and gives better caching control.

**Current font families:**

- `Newsreader`
- `Inter`
- `Space Grotesk`

**Optimizations:**

- self-host only the weights actually used
- subset fonts to required glyph ranges if possible
- ship `.woff2` locally through the app
- reduce total font bytes on first load

### 3.3 Reduce font family complexity

**Why:** three web font families increase render cost and transfer size.

**Optimizations:**

- evaluate whether one display font plus one body font is enough
- remove unused weights from `Inter`, `Newsreader`, and `Space Grotesk`
- consider using system fonts for uppercase navigation labels if the visual tradeoff is acceptable

### 3.4 Improve fallback behavior

**Why:** this reduces perceived rendering delay and layout movement.

**Optimizations:**

- keep `font-display: swap` or `optional`
- add metric-compatible fallbacks where possible
- test visible text before custom fonts finish loading

---

## 4. JavaScript and Main-Thread Optimizations

JavaScript is not the top problem, but there are still clear wins.

### 4.1 Reduce `framer-motion` on first-load content

**Why:** `framer-motion` contributes to first-load JS and main-thread work.

**Current code:**

- `site/src/pages/HomePage.tsx`
- `site/src/content/presentation.ts`
- `site/src/App.tsx`
- `site/vite.config.ts`

**Optimizations:**

- replace simple entrance animations with CSS where practical
- keep `framer-motion` only where it adds clear value
- reduce animated elements above the fold
- avoid loading animation-heavy code for the initial homepage if static presentation is sufficient

### 4.2 Separate icons from animation code

**Why:** the current `manualChunks` setup combines `framer-motion` and `lucide-react` into `motion-icons`.

**Current code:**

- `site/vite.config.ts`

**Optimizations:**

- split `lucide-react` and `framer-motion` into separate chunks
- keep the icon set cheap to load even if motion code is reduced later
- evaluate whether route-level lazy loading can further reduce first-load cost

### 4.3 Narrow icon imports

**Why:** even tree-shaken icon libraries can still create overhead.

**Current code examples:**

- `site/src/pages/HomePage.tsx`
- `site/src/components/SiteLayout.tsx`

**Optimizations:**

- continue importing only specific icons
- verify bundle output does not pull unnecessary icon modules
- consider replacing a few low-value icons with CSS or inline SVG if needed

### 4.4 Keep route-level code splitting healthy

**Why:** route splitting already exists and should be preserved.

**Current code:**

- `site/src/App.tsx`

**Optimizations:**

- preserve `lazy()` route loading
- avoid moving large shared logic into the root bundle unless necessary
- consider deferring non-essential homepage sections if they become heavier later

### 4.5 Audit runtime head updates

**Why:** route-level SEO logic is useful, but should stay lightweight.

**Current code:**

- `site/src/components/Seo.tsx`

**Optimizations:**

- keep SEO head updates minimal and synchronous
- avoid expensive structured data computation on routes where it is not needed
- memoize derived SEO payloads if computation grows in the future

---

## 5. Homepage and Above-the-Fold UX Optimizations

### 5.1 Simplify above-the-fold work

**Why:** the homepage currently does a lot immediately after boot.

**Current code:**

- `site/src/pages/HomePage.tsx`

**Optimizations:**

- minimize the amount of non-critical content rendered above the fold
- avoid expensive motion effects during initial paint
- keep the first visible frame mostly text + one optimized hero image

### 5.2 Re-evaluate sticky header cost

**Why:** sticky headers with blur can increase paint cost on mobile devices.

**Current code:**

- `site/src/App.css`
- `.topbar` uses `backdrop-filter: blur(14px)`

**Optimizations:**

- test whether reducing or removing backdrop blur improves paint cost on low-end devices
- use a flatter opaque or semi-opaque surface if needed
- keep the sticky header if UX benefit outweighs cost

### 5.3 Reduce first-scroll work

**Why:** cards and imagery further down the page can still affect mobile responsiveness.

**Optimizations:**

- lazy-load sections or images outside the first viewport
- avoid attaching expensive behavior to initial render for sections far below the fold

---

## 6. Content Pipeline Optimizations

The content pipeline is the best place to fix problems once for the whole site.

### 6.1 Add image processing to `content:build`

**Current code:**

- `site/scripts/content/build-content.mjs`
- `site/scripts/content/parse-legend.mjs`

**Optimizations:**

- generate optimized derivatives during build
- emit structured image metadata into generated files
- store width, height, format, and variant URLs
- make page components consume generated responsive image data instead of raw source paths

### 6.2 Distinguish card images from detail images

**Why:** the same source image should not serve every UI context.

**Optimizations:**

- add separate generated fields such as thumbnail, card, and detail variants
- use thumbnails in indexes and category listings
- use richer images only in full legend pages and social metadata

### 6.3 Validate generated asset consistency

**Why:** generated local assets must stay aligned with content changes.

**Optimizations:**

- ensure every generated image path is deterministic
- fail the build if referenced source images are missing
- document image generation behavior in `site/scripts/content/README.md`

---

## 7. Caching and Delivery Optimizations

Some of these are constrained by GitHub Pages, but they are still worth documenting.

### 7.1 Improve static asset cacheability where possible

**Why:** Lighthouse reports short cache lifetimes for images and static assets.

**Current constraint:**

- GitHub Pages has limited cache-control flexibility

**Optimizations:**

- rely on hashed filenames for JS/CSS/image derivatives
- keep generated assets immutable by filename
- prefer local hashed assets over raw GitHub URLs
- if stronger cache control is required later, consider a CDN or alternate hosting layer

### 7.2 Avoid third-party critical-path dependencies

**Why:** first-party assets are easier to cache and optimize.

**Optimizations:**

- self-host fonts
- self-host portraits and derived assets
- minimize any dependency on remote raw GitHub content in the live site

---

## 8. Vite and Build Output Optimizations

### 8.1 Review chunk boundaries after image work is done

**Current code:**

- `site/vite.config.ts`

**Optimizations:**

- re-check vendor chunking after reducing animation usage
- keep root route payload small
- ensure infrequently visited routes do not inflate homepage cost

### 8.2 Add bundle inspection to the workflow

**Why:** this makes regressions easier to detect.

**Optimizations:**

- add a bundle visualizer during local performance work
- document target bundle budgets for homepage-first load
- compare before/after chunk sizes after each optimization pass

---

## 9. Optional Longer-Term Improvements

These are good ideas, but they come after the core wins above.

### 9.1 Partial prerendering or static route precomputation

**Why:** if the homepage and legend pages ship more HTML up front, the browser can discover important assets sooner.

**Optimizations:**

- consider static prerendering for homepage and legend routes
- make critical metadata and hero content available before client boot
- evaluate whether a static-site-generation layer is worth the complexity

### 9.2 Service worker or offline caching

**Why:** this can improve repeat visits.

**Optimizations:**

- cache images and route assets for repeat visitors
- keep this secondary to first-visit performance improvements

### 9.3 Smarter image selection for SEO/social vs UI

**Why:** social preview quality and in-page performance do not need the same image variants.

**Optimizations:**

- keep richer images for Open Graph/Twitter cards
- use smaller, optimized images inside the actual page UI

---

## Recommended Implementation Order

### Phase 1: quick wins

1. preload the hero image
2. add `fetchpriority="high"` to the hero image
3. move fonts out of CSS `@import`
4. add `loading="lazy"` and `decoding="async"` to non-critical portraits

### Phase 2: biggest structural gain

5. update `site/scripts/content/build-content.mjs` to stop generating `raw.githubusercontent.com` UI image URLs
6. generate first-party local portrait assets
7. emit responsive image metadata into generated content

### Phase 3: payload refinement

8. convert hero and portrait assets to WebP/AVIF variants
9. use `srcset`/`sizes` in cards and detail pages
10. reduce `framer-motion` usage above the fold
11. split `framer-motion` and `lucide-react` into separate chunks

### Phase 4: optional platform improvements

12. self-host fonts fully
13. add bundle inspection tooling
14. evaluate prerendering or alternate hosting/CDN if stronger caching control is needed

---

## Validation Checklist

After each implementation pass, re-run:

```zsh
cd /Users/BenSolar/Repositories/computing-legends/site
npm run lint
npm run build
```

Then validate with a new mobile Lighthouse run and compare:

- LCP
- total image bytes
- render-blocking resources
- total blocking time
- cache insight

## Success Criteria

The strongest near-term success indicators are:

- hero LCP becomes materially faster
- total image transfer drops sharply
- homepage portraits no longer load massive raw GitHub originals
- Google Fonts stop appearing as a render-blocking bottleneck
- first-load JavaScript becomes smaller or less expensive on the homepage
