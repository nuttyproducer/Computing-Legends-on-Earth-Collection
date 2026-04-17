import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { parseLegendFile, sortLegendDetails } from './parse-legend.mjs'
import { scanRepositoryContent } from './scan-repo.mjs'

const SITE_ROOT = fileURLToPath(new URL('../../', import.meta.url))
const GENERATED_DIR = path.join(SITE_ROOT, 'src/content/generated')
const PUBLIC_DATA_DIR = path.join(SITE_ROOT, 'public/data')
const PUBLIC_DIR = path.join(SITE_ROOT, 'public')
const PUBLIC_LEGEND_IMAGE_DIR = path.join(PUBLIC_DIR, 'images/legends')
const PUBLIC_LEGEND_IMAGE_PREFIX = 'images/legends'
const PUBLIC_HERO_IMAGE_PATH = path.join(PUBLIC_DIR, 'images/landing/hero/hero-digital-age-archive.jpg')
const PUBLIC_HERO_GENERATED_DIR = path.join(PUBLIC_DIR, 'images/landing/hero/generated')
const PUBLIC_HERO_GENERATED_PREFIX = 'images/landing/hero/generated/hero-digital-age-archive'
const PORTRAIT_VARIANT_WIDTHS = [240, 320, 480, 720]
const HERO_VARIANT_WIDTHS = [320, 512]

const REPOSITORY_INFO = {
  owner: process.env.BITLORE_GITHUB_OWNER ?? 'nuttyproducer',
  repo: process.env.BITLORE_GITHUB_REPO ?? 'Computing-Legends-on-Earth-Collection',
  branch: process.env.BITLORE_GITHUB_BRANCH ?? 'website',
}

REPOSITORY_INFO.rawContentBase = `https://raw.githubusercontent.com/${REPOSITORY_INFO.owner}/${REPOSITORY_INFO.repo}/${REPOSITORY_INFO.branch}`

function normalizePosixPath(value) {
  return value.split(path.sep).join(path.posix.sep)
}

function stripMarkdownDecoration(value) {
  return value
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/`/g, '')
    .trim()
}

function normalizeLookupKey(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function createWikipediaUrl(name) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(name.trim().replace(/\s+/g, '_'))}`
}

function resolveContentPath(sourceDir, href) {
  const cleanHref = href.split('#')[0]
  return path.posix.normalize(path.posix.join(sourceDir, cleanHref))
}

function isExternalUrl(value) {
  return /^https?:\/\//i.test(value)
}

function createLegendCatalog(legendDetails) {
  const bySlug = new Map()
  const bySourceDirectory = new Map()
  const byName = new Map()

  const addName = (name, entry) => {
    if (!name) {
      return
    }

    const normalized = normalizeLookupKey(name)
    if (!normalized || byName.has(normalized)) {
      return
    }

    byName.set(normalized, entry)
  }

  for (const detail of legendDetails) {
    const entry = {
      slug: detail.slug,
      name: detail.name,
      fullName: detail.fullName,
      sourceDirectory: normalizePosixPath(path.posix.dirname(detail.sourcePath)),
    }

    bySlug.set(detail.slug, entry)
    bySourceDirectory.set(entry.sourceDirectory, entry)
    addName(detail.name, entry)
    addName(detail.fullName, entry)
    addName(titleFromSlug(detail.slug), entry)
  }

  return {
    bySlug,
    bySourceDirectory,
    byName,
  }
}

function resolveCatalogLink({ name, href, sourceDir, catalog }) {
  if (href) {
    if (isExternalUrl(href)) {
      return { href, resolvedSlug: undefined, kind: 'external' }
    }

    if (href.startsWith('/legend/')) {
      const slug = href.split('/').filter(Boolean).at(-1)
      return { href, resolvedSlug: slug, kind: 'internal' }
    }

    if (href.startsWith('/category/') || href === '/') {
      return { href, resolvedSlug: undefined, kind: 'internal' }
    }

    const normalizedTarget = resolveContentPath(sourceDir, href).replace(/\/$/, '')

    if (normalizedTarget === 'README.md' || normalizedTarget === 'README') {
      return { href: '/', resolvedSlug: undefined, kind: 'internal' }
    }

    const categoryOverviewMatch = normalizedTarget.match(/^([^/]+)\/README\.md$/)
    if (categoryOverviewMatch) {
      return { href: `/category/${categoryOverviewMatch[1]}`, resolvedSlug: undefined, kind: 'internal' }
    }

    const legendDirectory = normalizedTarget.replace(/\/README\.md$/, '')
    const directMatch = catalog.bySourceDirectory.get(legendDirectory)
    if (directMatch) {
      return { href: `/legend/${directMatch.slug}`, resolvedSlug: directMatch.slug, kind: 'internal' }
    }
  }

  const matchedEntry = name ? catalog.byName.get(normalizeLookupKey(name)) : undefined
  if (matchedEntry) {
    return { href: `/legend/${matchedEntry.slug}`, resolvedSlug: matchedEntry.slug, kind: 'internal' }
  }

  if (name) {
    return { href: createWikipediaUrl(name), resolvedSlug: undefined, kind: 'external' }
  }

  return { href: href ?? '/', resolvedSlug: undefined, kind: href && isExternalUrl(href) ? 'external' : 'internal' }
}

function normalizeMarkdownLinks(markdown, sourceDir, catalog) {
  return markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, href) => {
    const resolved = resolveCatalogLink({
      name: stripMarkdownDecoration(label),
      href: href.trim(),
      sourceDir,
      catalog,
    })

    return `[${label}](${resolved.href})`
  })
}

function normalizeRelatedFiguresMarkdown(markdown, sourceDir, catalog) {
  const normalizedLinkedMarkdown = normalizeMarkdownLinks(markdown, sourceDir, catalog)

  return normalizedLinkedMarkdown
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()

      if (/^\|/.test(trimmed) && !/^\|?(?:\s*:?-+:?\s*\|)+\s*$/.test(trimmed)) {
        const cells = trimmed.split('|').slice(1, -1).map((cell) => cell.trim())
        const firstCell = stripMarkdownDecoration(cells[0] ?? '')
        const secondCell = stripMarkdownDecoration(cells[1] ?? '')
        const thirdCell = stripMarkdownDecoration(cells[2] ?? '')
        const isHeaderRow = /^(person|name)$/i.test(firstCell)
          && /^(connection|relationship)$/i.test(secondCell)
          && /^(link|source)$/i.test(thirdCell)

        if (cells.length >= 3 && !isHeaderRow) {
          const personName = firstCell
          const currentHref = (cells[2].match(/\[[^\]]+\]\(([^)]+)\)/) ?? [])[1]
          const resolved = resolveCatalogLink({
            name: personName,
            href: currentHref,
            sourceDir,
            catalog,
          })

          cells[2] = `[${personName}](${resolved.href})`
          return `| ${cells.join(' | ')} |`
        }

        return line
      }

      if (trimmed.startsWith('- ') && !trimmed.includes('](')) {
        const bulletMatch = trimmed.match(/^[-*]\s+(?:\*\*|__)?(.+?)(?:\*\*|__)?\s+—\s+(.+)$/)

        if (bulletMatch) {
          const personName = stripMarkdownDecoration(bulletMatch[1])
          const resolved = resolveCatalogLink({
            name: personName,
            href: undefined,
            sourceDir,
            catalog,
          })

          return `- [${personName}](${resolved.href}) — ${bulletMatch[2]}`
        }
      }

      return line
    })
    .join('\n')
}

function normalizeRelatedFigures(relatedFigures, sourceDir, catalog) {
  return relatedFigures.map((figure) => {
    const resolved = resolveCatalogLink({
      name: figure.name,
      href: figure.href,
      sourceDir,
      catalog,
    })

    return {
      ...figure,
      href: resolved.href,
      resolvedSlug: resolved.resolvedSlug,
    }
  })
}

function normalizeLegendDetail(detail, catalog) {
  const sourceDir = normalizePosixPath(path.posix.dirname(detail.sourcePath))
  const sections = detail.sections.map((section) => {
    const markdown = section.kind === 'related-figures'
      ? normalizeRelatedFiguresMarkdown(section.markdown, sourceDir, catalog)
      : normalizeMarkdownLinks(section.markdown, sourceDir, catalog)

    return {
      ...section,
      markdown,
      subsections: section.subsections?.map((subsection) => ({
        ...subsection,
        markdown: normalizeMarkdownLinks(subsection.markdown, sourceDir, catalog),
      })),
    }
  })

  const relatedFigures = normalizeRelatedFigures(detail.relatedFigures, sourceDir, catalog)

  return {
    ...detail,
    leadMarkdown: detail.leadMarkdown ? normalizeMarkdownLinks(detail.leadMarkdown, sourceDir, catalog) : detail.leadMarkdown,
    sections,
    relatedFigures,
    relatedSlugs: [...new Set(relatedFigures.map((item) => item.resolvedSlug).filter(Boolean))],
  }
}

function getAssetExtension(filePath) {
  return path.extname(filePath).toLowerCase()
}

function isRasterImage(filePath) {
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(getAssetExtension(filePath))
}

function withoutFileExtension(filePath) {
  return filePath.replace(/\.[^.]+$/, '')
}

function getVariantWidths(widths, sourceWidth) {
  return [...new Set(widths.filter((width) => width <= sourceWidth).concat(sourceWidth))]
    .sort((left, right) => left - right)
}

async function createResponsiveWebpSources(sourceFilePath, publicRelativeBasePath, widths) {
  if (!isRasterImage(sourceFilePath)) {
    return {}
  }

  const metadata = await sharp(sourceFilePath).metadata()

  if (!metadata.width || !metadata.height) {
    return {}
  }

  const variantWidths = getVariantWidths(widths, metadata.width)
  const sources = await Promise.all(
    variantWidths.map(async (width) => {
      const height = Math.round((metadata.height / metadata.width) * width)
      const publicRelativePath = `${publicRelativeBasePath}-${width}w.webp`
      const targetFilePath = path.join(PUBLIC_DIR, normalizePosixPath(publicRelativePath))

      await mkdir(path.dirname(targetFilePath), { recursive: true })
      await sharp(sourceFilePath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toFile(targetFilePath)

      return {
        src: normalizePosixPath(publicRelativePath),
        width,
        height,
        type: 'image/webp',
      }
    }),
  )

  return {
    width: metadata.width,
    height: metadata.height,
    sources,
  }
}

function serializeWithBanner(contents) {
  return [
    '/* eslint-disable */',
    '// This file is generated by `npm run content:build`.',
    '// Do not edit manually.',
    '',
    contents,
    '',
  ].join('\n')
}

async function writeGeneratedFile(fileName, source) {
  await mkdir(GENERATED_DIR, { recursive: true })
  await writeFile(path.join(GENERATED_DIR, fileName), source, 'utf8')
}

async function writePublicDataFile(fileName, source) {
  await mkdir(PUBLIC_DATA_DIR, { recursive: true })
  await writeFile(path.join(PUBLIC_DATA_DIR, fileName), source, 'utf8')
}

async function writePublicFile(fileName, source) {
  await mkdir(PUBLIC_DIR, { recursive: true })
  await writeFile(path.join(PUBLIC_DIR, fileName), source, 'utf8')
}

function toRepoRelativeAssetPath(sourceUrl, repositoryInfo) {
  const normalizedBase = `${repositoryInfo.rawContentBase}/`

  if (!sourceUrl.startsWith(normalizedBase)) {
    return undefined
  }

  return sourceUrl.slice(normalizedBase.length).split(/[?#]/, 1)[0]
}

async function localizeLegendImageAsset(sourceUrl, repoRoot, repositoryInfo, localizedAssetMap) {
  const cached = localizedAssetMap.get(sourceUrl)
  if (cached) {
    return cached
  }

  const localizationPromise = (async () => {
    const repoRelativeAssetPath = toRepoRelativeAssetPath(sourceUrl, repositoryInfo)

    if (!repoRelativeAssetPath) {
      return { src: sourceUrl }
    }

    const publicRelativePath = normalizePosixPath(path.join(PUBLIC_LEGEND_IMAGE_PREFIX, repoRelativeAssetPath))
    const sourceFilePath = path.join(repoRoot, repoRelativeAssetPath)
    const targetFilePath = path.join(PUBLIC_DIR, publicRelativePath)
    const responsivePublicRelativeBasePath = normalizePosixPath(path.join(PUBLIC_LEGEND_IMAGE_PREFIX, withoutFileExtension(repoRelativeAssetPath)))

    await mkdir(path.dirname(targetFilePath), { recursive: true })
    await copyFile(sourceFilePath, targetFilePath)

    const responsiveMetadata = await createResponsiveWebpSources(
      sourceFilePath,
      responsivePublicRelativeBasePath,
      PORTRAIT_VARIANT_WIDTHS,
    )

    return {
      src: publicRelativePath,
      ...responsiveMetadata,
    }
  })()

  localizedAssetMap.set(sourceUrl, localizationPromise)
  return localizationPromise
}

async function localizeLegendDetailImages(detail, repoRoot, repositoryInfo, localizedAssetMap) {
  const localizedImages = await Promise.all(
    detail.images.map(async (image) => ({
      ...image,
      ...(await localizeLegendImageAsset(image.src, repoRoot, repositoryInfo, localizedAssetMap)),
    })),
  )

  const localizedPortrait = detail.portrait
    ? {
      ...detail.portrait,
      ...(await localizeLegendImageAsset(detail.portrait.src, repoRoot, repositoryInfo, localizedAssetMap)),
    }
    : undefined

  return {
    ...detail,
    images: localizedImages,
    portrait: localizedPortrait,
  }
}

async function generateHeroImageVariants() {
  await rm(PUBLIC_HERO_GENERATED_DIR, { recursive: true, force: true })
  await createResponsiveWebpSources(
    PUBLIC_HERO_IMAGE_PATH,
    PUBLIC_HERO_GENERATED_PREFIX,
    HERO_VARIANT_WIDTHS,
  )
}

function extractYears(text) {
  if (!text) {
    return []
  }

  return [...text.matchAll(/\b(1\d{3}|20\d{2})\b/g)].map((match) => Number(match[1]))
}

function formatCardLifespan(text) {
  if (!text) {
    return text
  }

  const years = extractYears(text)

  if (years.length >= 2) {
    return `${years[0]}–${years[1]}`
  }

  if (years.length === 1) {
    if (/\b(died|d\.)\b/i.test(text) && !/\b(born|b\.)\b/i.test(text)) {
      return `d. ${years[0]}`
    }

    if (/\b(born|b\.)\b/i.test(text) || !/\b(died|d\.)\b/i.test(text)) {
      return `b. ${years[0]}`
    }
  }

  return text
}

function createCollectionMeta(scanResult, legendDetailsList) {
  const totalResources = legendDetailsList.reduce(
    (sum, legend) => sum + legend.resources.length + legend.references.length,
    0,
  )

  const allYears = legendDetailsList.flatMap((legend) => [
    ...extractYears(legend.lifespan),
    ...legend.timeline.flatMap((item) => extractYears(item.year)),
  ])

  return {
    legendCount: legendDetailsList.length,
    categoryCount: scanResult.categories.length,
    totalResources,
    earliestYear: allYears.length > 0 ? Math.min(...allYears) : undefined,
    latestYear: allYears.length > 0 ? Math.max(...allYears) : undefined,
  }
}

function createCategorySummaries(scanResult, legendIndex) {
  return scanResult.categories.map((category) => ({
    id: category.id,
    label: category.label,
    count: category.count,
    featuredSlugs: legendIndex.filter((item) => item.category === category.id).slice(0, 3).map((item) => item.slug),
  }))
}

function createLegendIndex(legendDetails) {
  return legendDetails.map((detail) => ({
    id: detail.id,
    name: detail.name,
    slug: detail.slug,
    category: detail.category,
    categoryLabel: detail.categoryLabel,
    sourcePath: detail.sourcePath,
    portrait: detail.portrait,
    lifespan: formatCardLifespan(detail.lifespan),
    field: detail.field,
    keyContribution: detail.keyContribution,
    impact: detail.impact,
    summary: detail.summary,
    tags: detail.tags,
    relatedSlugs: detail.relatedSlugs,
    featured: detail.featured,
  }))
}

function createSitemapXml(categories, legendIndex) {
  const baseUrl = `https://${REPOSITORY_INFO.owner}.github.io/${REPOSITORY_INFO.repo}`
  const urls = [
    '/',
    ...categories.map((category) => `/category/${category.id}`),
    ...legendIndex.map((legend) => `/legend/${legend.slug}`),
  ]

  const urlEntries = urls
    .map((route) => `  <url>\n    <loc>${`${baseUrl}${route === '/' ? '/' : route}`}</loc>\n  </url>`)
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    '',
  ].join('\n')
}

function createRobotsTxt() {
  const baseUrl = `https://${REPOSITORY_INFO.owner}.github.io/${REPOSITORY_INFO.repo}`

  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    '',
  ].join('\n')
}

async function buildContent() {
  const scanResult = await scanRepositoryContent()
  const legends = scanResult.categories.flatMap((category) => category.legends)
  const localizedAssetMap = new Map()

  await rm(PUBLIC_LEGEND_IMAGE_DIR, { recursive: true, force: true })
  await generateHeroImageVariants()

  const parsedLegendDetails = await Promise.all(legends.map((legend) => parseLegendFile(legend, REPOSITORY_INFO)))
  const legendDetailsList = sortLegendDetails(
    await Promise.all(
      parsedLegendDetails.map((detail) =>
        localizeLegendDetailImages(detail, scanResult.repoRoot, REPOSITORY_INFO, localizedAssetMap),
      ),
    ),
  )
  const catalog = createLegendCatalog(legendDetailsList)
  const normalizedLegendDetailsList = legendDetailsList.map((detail) => normalizeLegendDetail(detail, catalog))
  const legendIndex = createLegendIndex(normalizedLegendDetailsList)
  const categories = createCategorySummaries(scanResult, legendIndex)
  const legendDetails = Object.fromEntries(normalizedLegendDetailsList.map((detail) => [detail.slug, detail]))
  const collectionMeta = createCollectionMeta(scanResult, normalizedLegendDetailsList)

  await writeGeneratedFile(
    'legend-index.generated.ts',
    serializeWithBanner(
      [
        "import type { LegendIndexEntry } from '../types'",
        '',
        `export const legendIndex = ${JSON.stringify(legendIndex, null, 2)} satisfies LegendIndexEntry[]`,
      ].join('\n'),
    ),
  )

  await writeGeneratedFile(
    'legend-details.generated.ts',
    serializeWithBanner(
      [
        "import type { LegendDetail } from '../types'",
        '',
        `export const legendDetails = ${JSON.stringify(legendDetails, null, 2)} satisfies Record<string, LegendDetail>`,
      ].join('\n'),
    ),
  )

  await writePublicDataFile('legend-details.generated.json', JSON.stringify(legendDetails, null, 2))

  await writeGeneratedFile(
    'categories.generated.ts',
    serializeWithBanner(
      [
        "import type { CategorySummary } from '../types'",
        '',
        `export const categories = ${JSON.stringify(categories, null, 2)} satisfies CategorySummary[]`,
      ].join('\n'),
    ),
  )

  await writeGeneratedFile(
    'collection-meta.generated.ts',
    serializeWithBanner(
      [
        'export const collectionMeta = ' + JSON.stringify(collectionMeta, null, 2) + ' as const',
      ].join('\n'),
    ),
  )

  await writePublicFile('sitemap.xml', createSitemapXml(categories, legendIndex))
  await writePublicFile('robots.txt', createRobotsTxt())

  await writeGeneratedFile(
    'index.ts',
    serializeWithBanner(
      [
        "import type { GeneratedLegendContent } from '../types'",
        "import { categories } from './categories.generated'",
        "import { collectionMeta } from './collection-meta.generated'",
        "import { legendDetails } from './legend-details.generated'",
        "import { legendIndex } from './legend-index.generated'",
        '',
        'export { categories, collectionMeta, legendDetails, legendIndex }',
        '',
        'export const generatedLegendContent = {',
        '  categories,',
        '  legendIndex,',
        '  legendDetails,',
        '} satisfies GeneratedLegendContent',
      ].join('\n'),
    ),
  )

  console.log(`Generated content for ${legendIndex.length} legends.`)
  console.log(`Output directory: ${GENERATED_DIR}`)
  console.log(`Localized legend images written to: ${PUBLIC_LEGEND_IMAGE_DIR}`)
  console.log(`Responsive hero images written to: ${PUBLIC_HERO_GENERATED_DIR}`)
  console.log(`Sitemap written to: ${path.join(PUBLIC_DIR, 'sitemap.xml')}`)
  console.log(`Robots written to: ${path.join(PUBLIC_DIR, 'robots.txt')}`)
}

buildContent().catch((error) => {
  console.error('Failed to build generated content.')
  console.error(error)
  process.exitCode = 1
})