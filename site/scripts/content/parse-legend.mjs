import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import { toString } from 'mdast-util-to-string'
import { visit } from 'unist-util-visit'

const processor = remark().use(remarkGfm)

const SECTION_KIND_MATCHERS = [
  { kind: 'quick-facts', test: /^(quick facts|at a glance)$/i },
  { kind: 'biography', test: /^biography$/i },
  { kind: 'contributions', test: /^(major contributions|contributions)$/i },
  { kind: 'publications', test: /^(publications(\s*&\s*works)?|key publications(\s*&\s*works)?|selected publications)$/i },
  { kind: 'awards', test: /^(awards(\s*&\s*honors)?|awards & honors)$/i },
  { kind: 'quotes', test: /^(quotes|notable quotes|famous quotes)$/i },
  { kind: 'influence', test: /^(influence(\s*&\s*legacy)?|influence & legacy)$/i },
  { kind: 'related-figures', test: /^related figures$/i },
  { kind: 'resources', test: /^resources$/i },
  { kind: 'timeline', test: /^timeline$/i },
  { kind: 'references', test: /^references$/i },
  { kind: 'navigation', test: /^navigation$/i },
]

const RESOURCE_KIND_BY_SECTION = [
  { test: /primary sources?/i, kind: 'primary-source' },
  { test: /biograph/i, kind: 'biography' },
  { test: /documentar/i, kind: 'documentary' },
  { test: /technical/i, kind: 'technical-resource' },
  { test: /interviews?/i, kind: 'interview' },
  { test: /talks?/i, kind: 'talk' },
  { test: /films?/i, kind: 'documentary' },
  { test: /archives?/i, kind: 'archive' },
]

const CATEGORY_ORDER = [
  'pioneers',
  'foundational-cs',
  'systems-languages',
  'ai-pioneers',
  'modern-ai-ml',
  'web-internet',
]

function normalizeLineEndings(value) {
  return value.replace(/\r\n/g, '\n')
}

function trimBlock(value) {
  return value.replace(/^\s+/, '').replace(/\s+$/, '')
}

function stripDecorativePortraitMarkup(value) {
  return trimBlock(
    value
      .replace(/^(?:\s*<img[^>]*>\s*)+/gi, '')
      .replace(/^(?:\s*!\[[^\]]*\]\([^)]+\)\s*)+/g, '')
      .replace(/<br\s+clear="left"\s*\/?>\s*/gi, ''),
  )
}

function normalizeHeadingTitle(title) {
  const withoutDecorators = title.replace(/^[^\p{L}\p{N}]+/u, '')
  return withoutDecorators.replace(/\s+/g, ' ').trim()
}

function stripMarkdownDecoration(value) {
  return value
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/`/g, '')
    .trim()
}

function normalizeMetadataLabel(label) {
  const normalized = stripMarkdownDecoration(label)
    .toLowerCase()
    .replace(/[.:]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (normalized === 'field' || normalized === 'fields') {
    return 'field'
  }

  if (normalized === 'full name') {
    return 'full-name'
  }

  if (normalized === 'lifespan') {
    return 'lifespan'
  }

  if (normalized === 'born') {
    return 'born'
  }

  if (normalized === 'died') {
    return 'died'
  }

  if (normalized === 'nationality') {
    return 'nationality'
  }

  if (normalized === 'key contribution' || normalized === 'key contributions') {
    return 'key-contribution'
  }

  if (normalized === 'impact') {
    return 'impact'
  }

  if (normalized === 'turing award') {
    return 'turing-award'
  }

  return 'other'
}

function sectionKindFromTitle(title) {
  for (const matcher of SECTION_KIND_MATCHERS) {
    if (matcher.test.test(title)) {
      return matcher.kind
    }
  }

  return 'custom-markdown'
}

function extractTitleName(title) {
  return title.replace(/\s*\((?:b\.\s*)?\d{4}[^)]*\)\s*$/i, '').trim()
}

function formatDisplayName(name) {
  if (/[A-Z]/.test(name)) {
    return name
  }

  return name.replace(/\b([a-z])/g, (match) => match.toUpperCase())
}

function extractTrailingLifespan(title) {
  const match = title.match(/\(((?:b\.\s*)?\d{4}[^)]*)\)\s*$/i)
  return match ? match[1].trim() : undefined
}

function extractFactDateDisplay(value) {
  if (!value) {
    return undefined
  }

  const normalized = stripMarkdownDecoration(value).replace(/\s+/g, ' ').trim()
  const [datePart] = normalized.split(/\s+[—–-]\s+/)
  return datePart?.trim() || undefined
}

function formatLifespanFromFacts(quickFacts) {
  const born = extractFactDateDisplay(getFactValue(quickFacts, 'born'))
  const died = extractFactDateDisplay(getFactValue(quickFacts, 'died'))

  if (born && died) {
    return `${born} – ${died}`
  }

  if (born) {
    return `b. ${born}`
  }

  if (died) {
    return `d. ${died}`
  }

  return undefined
}

function splitSubsections(markdown) {
  const matches = [...markdown.matchAll(/^###\s+(.+)$/gm)]

  if (matches.length === 0) {
    return []
  }

  return matches.map((match, index) => {
    const start = match.index ?? 0
    const end = index < matches.length - 1 ? (matches[index + 1].index ?? markdown.length) : markdown.length
    const title = normalizeHeadingTitle(match[1])
    const bodyStart = start + match[0].length

    return {
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title,
      markdown: trimBlock(markdown.slice(bodyStart, end)),
    }
  })
}

function parseMarkdownTable(markdown) {
  const lines = markdown.split('\n')
  const tableLines = []
  let started = false

  for (const line of lines) {
    if (/^\|/.test(line.trim())) {
      tableLines.push(line.trim())
      started = true
      continue
    }

    if (started) {
      break
    }
  }

  if (tableLines.length < 2) {
    return null
  }

  const rows = tableLines
    .filter((line, index) => !(index === 1 && /^\|?(?:\s*:?-+:?\s*\|)+\s*$/.test(line)))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))

  if (rows.length < 2) {
    return null
  }

  const [headers, ...dataRows] = rows

  return {
    headers,
    rows: dataRows,
  }
}

function dedupeQuickFacts(items) {
  const seen = new Set()
  const results = []

  for (const item of items) {
    const key = `${item.normalizedLabel}:${item.value}`
    if (!item.value || seen.has(key)) {
      continue
    }

    seen.add(key)
    results.push(item)
  }

  return results
}

function extractMetadataFacts(markdown) {
  const results = []

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim()
    const match = line.match(/^(?:-\s+)?\*\*([^*]+?)\*\*\s*:?(.*)$/)

    if (!match || !match[2].trim()) {
      continue
    }

    results.push({
      label: stripMarkdownDecoration(match[1]),
      normalizedLabel: normalizeMetadataLabel(match[1]),
      value: stripMarkdownDecoration(match[2]),
    })
  }

  return dedupeQuickFacts(results)
}

function extractQuickFactsFromTable(markdown) {
  const table = parseMarkdownTable(markdown)

  if (!table) {
    return []
  }

  return dedupeQuickFacts(
    table.rows
      .filter((row) => row.length >= 2)
      .map((row) => ({
        label: stripMarkdownDecoration(row[0]),
        normalizedLabel: normalizeMetadataLabel(row[0]),
        value: stripMarkdownDecoration(row.slice(1).join(' | ')),
      })),
  )
}

function extractMarkdownLinks(line) {
  return [...line.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((match) => ({
    label: stripMarkdownDecoration(match[1]),
    href: match[2].trim(),
  }))
}

function isExternalUrl(value) {
  return /^https?:\/\//i.test(value)
}

function normalizePosixPath(value) {
  return value.split(path.sep).join(path.posix.sep)
}

function resolveContentPath(sourceDir, href) {
  const cleanHref = href.split('#')[0]
  return path.posix.normalize(path.posix.join(sourceDir, cleanHref))
}

function resolveInternalLink(href, sourceDir) {
  if (isExternalUrl(href)) {
    return {
      href,
      kind: 'external',
    }
  }

  const normalizedTarget = resolveContentPath(sourceDir, href).replace(/\/$/, '')

  if (normalizedTarget === 'README.md' || normalizedTarget === 'README') {
    return {
      href: '/',
      kind: 'internal',
    }
  }

  const categoryOverviewMatch = normalizedTarget.match(/^([^/]+)\/README\.md$/)
  if (categoryOverviewMatch) {
    return {
      href: `/category/${categoryOverviewMatch[1]}`,
      kind: 'internal',
    }
  }

  const legendMatch = normalizedTarget.match(/^([^/]+)\/([^/]+)(?:\/README\.md)?$/)
  if (legendMatch) {
    return {
      href: `/legend/${legendMatch[2]}`,
      kind: 'internal',
      resolvedSlug: legendMatch[2],
    }
  }

  return {
    href,
    kind: 'internal',
  }
}

function directionFromLabel(label) {
  const normalized = label.toLowerCase()

  if (normalized.includes('main index')) {
    return 'main-index'
  }

  if (normalized.includes('category overview')) {
    return 'category-overview'
  }

  if (normalized.includes('previous')) {
    return 'previous'
  }

  if (normalized.includes('next')) {
    return 'next'
  }

  return 'other'
}

function classifyResourceKind(sectionTitle, item) {
  const context = `${sectionTitle ?? ''} ${item.title} ${item.description ?? ''}`

  if (item.url && /(youtube\.com|youtu\.be)/i.test(item.url)) {
    if (/interview/i.test(context)) {
      return 'interview'
    }
    if (/talk/i.test(context)) {
      return 'talk'
    }
    return 'documentary'
  }

  for (const matcher of RESOURCE_KIND_BY_SECTION) {
    if (matcher.test.test(sectionTitle ?? '')) {
      return matcher.kind
    }
  }

  if (/documentary/i.test(context)) {
    return 'documentary'
  }

  if (/interview/i.test(context)) {
    return 'interview'
  }

  if (/talk/i.test(context)) {
    return 'talk'
  }

  if (/book|biography/i.test(context)) {
    return 'book'
  }

  return item.url ? 'article' : 'other'
}

function parseResourceLine(line, sectionTitle) {
  const trimmed = line.trim()

  if (!trimmed.startsWith('- ')) {
    return null
  }

  const body = trimmed.slice(2).trim()
  const [mainPart, descriptionPart] = body.split(/\s+—\s+/, 2)
  const links = extractMarkdownLinks(mainPart)

  if (links.length > 0) {
    const firstLink = links[0]
    let host

    if (isExternalUrl(firstLink.href)) {
      try {
        host = new URL(firstLink.href).hostname.replace(/^www\./, '')
      } catch {
        host = undefined
      }
    }

    const resource = {
      title: firstLink.label,
      url: firstLink.href,
      description: descriptionPart?.trim(),
      sectionTitle,
      kind: 'other',
      host,
      isEmbeddable: Boolean(firstLink.href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)/i)),
    }

    resource.kind = classifyResourceKind(sectionTitle, resource)
    return resource
  }

  const plainTitleMatch = mainPart.match(/^\*\*([^*]+)\*\*(.*)$/)
  const title = plainTitleMatch ? stripMarkdownDecoration(plainTitleMatch[1]) : stripMarkdownDecoration(mainPart)
  const tail = plainTitleMatch ? stripMarkdownDecoration(plainTitleMatch[2]) : ''
  const description = [tail, descriptionPart].filter(Boolean).join(' — ').trim() || undefined

  const resource = {
    title,
    description,
    sectionTitle,
    kind: 'other',
  }

  resource.kind = classifyResourceKind(sectionTitle, resource)
  return resource
}

function getYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace(/^\//, '')
      return id ? `https://www.youtube.com/embed/${id}` : undefined
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : undefined
    }
  } catch {
    return undefined
  }

  return undefined
}

function mediaKindFromResource(resource) {
  if (resource.kind === 'interview') {
    return 'interview'
  }

  if (resource.kind === 'talk') {
    return 'talk'
  }

  if (resource.kind === 'documentary') {
    return 'documentary'
  }

  if (resource.kind === 'archive') {
    return 'archive'
  }

  return 'video'
}

function extractResources(markdown) {
  const resources = []
  let currentSectionTitle

  for (const line of markdown.split('\n')) {
    const subsectionMatch = line.match(/^###\s+(.+)$/)
    if (subsectionMatch) {
      currentSectionTitle = normalizeHeadingTitle(subsectionMatch[1])
      continue
    }

    const resource = parseResourceLine(line, currentSectionTitle)
    if (resource) {
      resources.push(resource)
    }
  }

  return resources
}

function extractMediaItems(resources) {
  return resources
    .filter(
      (resource) =>
        resource.kind === 'documentary' ||
        resource.kind === 'interview' ||
        resource.kind === 'talk' ||
        resource.isEmbeddable,
    )
    .map((resource) => ({
      title: resource.title,
      url: resource.url,
      description: resource.description,
      sourceSectionTitle: resource.sectionTitle,
      kind: mediaKindFromResource(resource),
      provider: resource.host,
      embedUrl: resource.url ? getYouTubeEmbedUrl(resource.url) : undefined,
      isEmbeddable: Boolean(resource.url && getYouTubeEmbedUrl(resource.url)),
    }))
}

function extractQuotes(markdown) {
  const lines = markdown.split('\n')
  const quotes = []
  let current = []

  function flush() {
    if (current.length === 0) {
      return
    }

    const cleaned = current.map((line) => line.replace(/^>\s?/, '').trim())
    const attributionLine = cleaned.find((line) => /^—\s*/.test(line))
    const textLines = cleaned.filter((line) => line && !/^—\s*/.test(line))

    if (textLines.length > 0) {
      quotes.push({
        text: stripMarkdownDecoration(textLines.join(' ').replace(/\s+/g, ' ')),
        attribution: attributionLine ? stripMarkdownDecoration(attributionLine.replace(/^—\s*/, '')) : undefined,
      })
    }

    current = []
  }

  for (const line of lines) {
    if (line.trim().startsWith('>')) {
      current.push(line)
      continue
    }

    if (current.length > 0) {
      flush()
    }
  }

  flush()
  return quotes
}

function extractReferences(markdown) {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s+/.test(line))
    .map((line) => {
      const text = line.replace(/^\d+\.\s+/, '')
      const link = extractMarkdownLinks(text)[0]
      return {
        text: stripMarkdownDecoration(text),
        url: link?.href,
      }
    })
}

function extractTimeline(markdown) {
  const table = parseMarkdownTable(markdown)

  if (!table) {
    return []
  }

  return table.rows
    .filter((row) => row.length >= 2)
    .map((row) => ({
      year: stripMarkdownDecoration(row[0]),
      event: stripMarkdownDecoration(row.slice(1).join(' | ')),
    }))
}

function extractAwards(markdown) {
  const table = parseMarkdownTable(markdown)

  if (!table) {
    return []
  }

  return table.rows
    .filter((row) => row.length >= 2)
    .map((row) => ({
      year: stripMarkdownDecoration(row[0]) || undefined,
      title: stripMarkdownDecoration(row[1]) || 'Unknown award',
      organization: row[2] ? stripMarkdownDecoration(row[2]) : undefined,
      reason: row[3] ? stripMarkdownDecoration(row[3]) : undefined,
      rawCells: row.map((cell) => stripMarkdownDecoration(cell)),
    }))
}

function extractRelatedFigures(markdown, sourceDir) {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .flatMap((line) => {
      const links = extractMarkdownLinks(line)
      if (links.length === 0) {
        return []
      }

      return links.map((link) => {
        const resolved = resolveInternalLink(link.href, sourceDir)
        const relationshipMatch = line.match(/\s+—\s+(.+)$/)

        return {
          name: link.label,
          href: resolved.href,
          resolvedSlug: resolved.resolvedSlug,
          relationship: relationshipMatch ? stripMarkdownDecoration(relationshipMatch[1]) : undefined,
        }
      })
    })
}

function extractNavigation(markdown, sourceDir) {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .flatMap((line) =>
      extractMarkdownLinks(line).map((link) => {
        const resolved = resolveInternalLink(link.href, sourceDir)
        return {
          label: link.label,
          href: resolved.href,
          resolvedSlug: resolved.resolvedSlug,
          direction: directionFromLabel(link.label),
        }
      }),
    )
}

function extractImages(markdown, legendFile, repositoryInfo) {
  const sourceDir = normalizePosixPath(legendFile.relativeDirectoryPath)
  const htmlMatches = [...markdown.matchAll(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g)].map((match) => ({
    src: match[1],
    alt: match[2] || legendFile.slug,
  }))
  const markdownMatches = [...markdown.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)].map((match) => ({
    src: match[2],
    alt: match[1] || legendFile.slug,
  }))
  const seen = new Set()

  return [...htmlMatches, ...markdownMatches].flatMap((image, index) => {
    const source = image.src.trim()
    const key = `${source}:${image.alt}`
    if (seen.has(key)) {
      return []
    }

    seen.add(key)

    const resolvedSrc = isExternalUrl(source)
      ? source
      : `${repositoryInfo.rawContentBase}/${resolveContentPath(sourceDir, source)}`

    return [
      {
        src: resolvedSrc,
        alt: stripMarkdownDecoration(image.alt),
        isPortrait: index === 0,
      },
    ]
  })
}

function extractSummary(markdown) {
  const blocks = markdown
    .split(/\n\s*\n/)
    .map((block) => trimBlock(block))
    .filter(Boolean)

  for (const block of blocks) {
    if (/^(###|\||-|>|\*\*)/.test(block)) {
      continue
    }

    return stripMarkdownDecoration(block.replace(/\n+/g, ' '))
  }

  return undefined
}

function getFactValue(quickFacts, normalizedLabel) {
  return quickFacts.find((item) => item.normalizedLabel === normalizedLabel)?.value
}

function createSections(markdown, tree) {
  const sections = []
  const headings = []

  visit(tree, 'heading', (node) => {
    if (node.depth === 2) {
      headings.push(node)
    }
  })

  headings.forEach((node, index) => {
    const start = node.position?.start?.offset ?? 0
    const headingEnd = node.position?.end?.offset ?? start
    const end = index < headings.length - 1 ? headings[index + 1].position?.start?.offset ?? markdown.length : markdown.length
    const rawTitle = toString(node).trim()
    const title = normalizeHeadingTitle(rawTitle)
    const bodyMarkdown = stripDecorativePortraitMarkup(markdown.slice(headingEnd, end))

    sections.push({
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      kind: sectionKindFromTitle(title),
      title,
      markdown: bodyMarkdown,
      subsections: splitSubsections(bodyMarkdown),
    })
  })

  return sections
}

export async function parseLegendFile(legendFile, repositoryInfo) {
  const rawMarkdown = normalizeLineEndings(await readFile(legendFile.readmePath, 'utf8'))
  const tree = processor.parse(rawMarkdown)
  let titleNode
  let firstDepthTwoHeading

  visit(tree, 'heading', (node) => {
    if (!titleNode && node.depth === 1) {
      titleNode = node
    }

    if (!firstDepthTwoHeading && node.depth === 2) {
      firstDepthTwoHeading = node
    }
  })

  if (!titleNode) {
    throw new Error(`Missing H1 heading in ${legendFile.relativeReadmePath}`)
  }

  const titleText = toString(titleNode).trim()
  const displayName = formatDisplayName(extractTitleName(titleText))
  const sections = createSections(rawMarkdown, tree)
  const firstSectionStart = firstDepthTwoHeading?.position?.start?.offset ?? rawMarkdown.length
  const leadMarkdown = stripDecorativePortraitMarkup(rawMarkdown.slice(titleNode.position?.end?.offset ?? 0, firstSectionStart))
  const leadQuickFacts = extractMetadataFacts(leadMarkdown)
  const quickFactsSection = sections.find((section) => section.kind === 'quick-facts')
  const quickFacts = dedupeQuickFacts([
    ...leadQuickFacts,
    ...extractQuickFactsFromTable(quickFactsSection?.markdown ?? ''),
    ...extractMetadataFacts(quickFactsSection?.markdown ?? ''),
  ])
  const images = extractImages(rawMarkdown, legendFile, repositoryInfo)
  const portrait = images.find((image) => image.isPortrait)
  const introQuote = extractQuotes(leadMarkdown)[0]
  const biographySection = sections.find((section) => section.kind === 'biography')
  const awardsSection = sections.find((section) => section.kind === 'awards')
  const quotesSection = sections.find((section) => section.kind === 'quotes')
  const relatedFiguresSection = sections.find((section) => section.kind === 'related-figures')
  const resourcesSection = sections.find((section) => section.kind === 'resources')
  const timelineSection = sections.find((section) => section.kind === 'timeline')
  const referencesSection = sections.find((section) => section.kind === 'references')
  const navigationSection = sections.find((section) => section.kind === 'navigation')
  const field = getFactValue(quickFacts, 'field')
  const lifespan = getFactValue(quickFacts, 'lifespan')
    ?? formatLifespanFromFacts(quickFacts)
    ?? extractTrailingLifespan(titleText)
  const relatedFigures = extractRelatedFigures(relatedFiguresSection?.markdown ?? '', normalizePosixPath(legendFile.relativeDirectoryPath))
  const resources = extractResources(resourcesSection?.markdown ?? '')
  const navigation = extractNavigation(navigationSection?.markdown ?? '', normalizePosixPath(legendFile.relativeDirectoryPath))
  const quotes = quotesSection ? extractQuotes(quotesSection.markdown) : []

  return {
    id: legendFile.id,
    name: displayName,
    fullName: getFactValue(quickFacts, 'full-name') ?? displayName,
    slug: legendFile.slug,
    category: legendFile.category,
    categoryLabel: legendFile.categoryLabel,
    sourcePath: legendFile.relativeReadmePath,
    portrait,
    images,
    lifespan,
    field,
    keyContribution: getFactValue(quickFacts, 'key-contribution'),
    impact: getFactValue(quickFacts, 'impact'),
    summary: extractSummary(biographySection?.markdown ?? '') ?? undefined,
    leadMarkdown,
    tags: [
      ...(field ? field.split(',').map((item) => item.trim()).filter(Boolean) : []),
      legendFile.categoryLabel,
    ],
    relatedSlugs: relatedFigures.map((item) => item.resolvedSlug).filter(Boolean),
    featured: false,
    introQuote,
    quickFacts,
    sections,
    awards: extractAwards(awardsSection?.markdown ?? ''),
    quotes,
    timeline: extractTimeline(timelineSection?.markdown ?? ''),
    relatedFigures,
    resources,
    mediaItems: extractMediaItems(resources),
    references: extractReferences(referencesSection?.markdown ?? ''),
    navigation,
  }
}

export function sortLegendDetails(details) {
  return [...details].sort((left, right) => {
    const categoryDelta = CATEGORY_ORDER.indexOf(left.category) - CATEGORY_ORDER.indexOf(right.category)
    if (categoryDelta !== 0) {
      return categoryDelta
    }

    return left.name.localeCompare(right.name)
  })
}