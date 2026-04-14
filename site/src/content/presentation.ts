import { categories as generatedCategories, collectionMeta, legendIndex } from './generated'
import type { CategoryId } from './types'

function normalizeSearchText(value?: string) {
  return value?.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim() ?? ''
}

export function getSearchTerms(query?: string) {
  return normalizeSearchText(query)
    .split(' ')
    .filter(Boolean)
}

export const personaPromises = [
  {
    title: 'For students',
    description:
      'Find context fast, see who influenced whom, and turn names from lectures into stories you will remember.',
  },
  {
    title: 'For engineers',
    description:
      "Trace the lineage from Boolean logic to deep learning and connect today's tools to their intellectual roots.",
  },
  {
    title: 'For educators and writers',
    description:
      'Use a structured, shareable knowledge base built for teaching, referencing, and deeper historical exploration.',
  },
] as const

export const categoryPresentation: Record<CategoryId, { era: string; description: string }> = {
  pioneers: {
    era: 'Pre-1950',
    description:
      'The visionaries who imagined programmable machines before modern electronics existed.',
  },
  'foundational-cs': {
    era: '1950s–1970s',
    description:
      'The theorists who turned logic, information, and algorithms into computer science.',
  },
  'systems-languages': {
    era: 'Compilers to Operating Systems',
    description:
      'The builders who gave software structure, syntax, and systems people could actually use.',
  },
  'ai-pioneers': {
    era: '1950s–1980s',
    description:
      'The early thinkers who asked whether machines could reason, learn, and decide.',
  },
  'modern-ai-ml': {
    era: 'Current Frontiers',
    description:
      'The researchers who pushed neural networks and modern machine learning into the mainstream.',
  },
  'web-internet': {
    era: 'Protocols & Hypertext',
    description:
      'The architects who connected the world through the web, browsers, and digital infrastructure.',
  },
}

export const featuredSlugs = ['ada-lovelace', 'alan-turing', 'geoffrey-hinton'] as const

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: 'easeOut' as const },
}

export function extractYears(text?: string) {
  if (!text) {
    return []
  }

  return [...text.matchAll(/\b(1\d{3}|20\d{2})\b/g)].map((match) => Number(match[1]))
}

export function formatCompactLifespan(text?: string) {
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

    return `b. ${years[0]}`
  }

  return text
}

export function summarizeMarkdown(markdown?: string, maxLength = 220) {
  if (!markdown) {
    return undefined
  }

  const plainText = toPlainText(markdown)

  if (plainText.length <= maxLength) {
    return plainText
  }

  return `${plainText.slice(0, maxLength).trimEnd()}…`
}

export function toPlainText(markdown?: string) {
  if (!markdown) {
    return ''
  }

  return markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/\*\*|__|`|\*/g, '')
    .replace(/\|/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractParagraphs(markdown?: string, maxParagraphs = 3) {
  if (!markdown) {
    return []
  }

  return markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => !/^(#{1,6}|\||-|>|\*\*)/.test(block))
    .map((block) => toPlainText(block))
    .filter(Boolean)
    .slice(0, maxParagraphs)
}

export function extractBulletItems(markdown?: string, maxItems = 6) {
  if (!markdown) {
    return []
  }

  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => toPlainText(line.replace(/^-\s+/, '')))
    .filter(Boolean)
    .slice(0, maxItems)
}

export function searchLegends(query?: string, categoryId?: CategoryId | 'all') {
  const terms = getSearchTerms(query)

  const scopedEntries = legendIndex.filter((entry) => !categoryId || categoryId === 'all' || entry.category === categoryId)

  if (terms.length === 0) {
    return [...scopedEntries].sort((left, right) => left.name.localeCompare(right.name))
  }

  return scopedEntries
    .map((entry) => {
      const searchFields = {
        name: normalizeSearchText(entry.name),
        field: normalizeSearchText(entry.field),
        category: normalizeSearchText(entry.categoryLabel),
        impact: normalizeSearchText(entry.impact),
        summary: normalizeSearchText(entry.summary),
        tags: entry.tags.map((tag) => normalizeSearchText(tag)).join(' '),
      }

      const haystack = Object.values(searchFields).join(' ')
      if (!terms.every((term) => haystack.includes(term))) {
        return undefined
      }

      const score = terms.reduce((total, term) => {
        let nextScore = total

        if (searchFields.name.includes(term)) nextScore += 10
        if (searchFields.field.includes(term)) nextScore += 6
        if (searchFields.tags.includes(term)) nextScore += 5
        if (searchFields.category.includes(term)) nextScore += 4
        if (searchFields.impact.includes(term)) nextScore += 3
        if (searchFields.summary.includes(term)) nextScore += 2

        return nextScore
      }, 0)

      return { entry, score }
    })
    .filter((item): item is { entry: (typeof legendIndex)[number]; score: number } => Boolean(item))
    .sort((left, right) => right.score - left.score || left.entry.name.localeCompare(right.entry.name))
    .map((item) => item.entry)
}

export function getSearchCategoryOptions() {
  return [
    { id: 'all' as const, label: 'All Wings' },
    ...generatedCategories.map((category) => ({ id: category.id, label: category.label })),
  ]
}

export function getSearchSuggestions(categoryId?: CategoryId | 'all', query?: string) {
  const scopedEntries = legendIndex.filter((entry) => !categoryId || categoryId === 'all' || entry.category === categoryId)
  const exactQuery = normalizeSearchText(query)
  const queryTerms = new Set(getSearchTerms(query))
  const suggestionScores = new Map<string, number>()

  const addSuggestion = (label: string | undefined, score: number) => {
    if (!label) {
      return
    }

    const normalizedLabel = normalizeSearchText(label)
    if (!normalizedLabel || normalizedLabel.length < 3) {
      return
    }

    if (normalizedLabel === exactQuery || queryTerms.has(normalizedLabel)) {
      return
    }

    suggestionScores.set(label, (suggestionScores.get(label) ?? 0) + score)
  }

  const category = generatedCategories.find((entry) => entry.id === categoryId)

  category?.featuredSlugs.forEach((slug) => {
    const legend = scopedEntries.find((entry) => entry.slug === slug)
    addSuggestion(legend?.name, 10)
  })

  scopedEntries.forEach((entry) => {
    addSuggestion(entry.field, 6)
    addSuggestion(entry.categoryLabel, 2)
    entry.tags.forEach((tag) => addSuggestion(tag, tag === entry.categoryLabel ? 1 : 4))
  })

  return [...suggestionScores.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 8)
    .map(([label]) => label)
}

export function getHomepageCategories() {
  return generatedCategories.map((category) => ({
    id: category.id,
    name: category.label,
    era: categoryPresentation[category.id].era,
    description: categoryPresentation[category.id].description,
    count: category.count,
  }))
}

export function getHomepageFeaturedLegends() {
  return featuredSlugs
    .map((slug) => legendIndex.find((entry) => entry.slug === slug))
    .filter((legend): legend is (typeof legendIndex)[number] => Boolean(legend))
    .map((legend) => ({
      slug: legend.slug,
      name: legend.name,
      years: legend.lifespan ?? 'Dates unavailable',
      archiveNo: `Archive No. ${String(legendIndex.findIndex((item) => item.slug === legend.slug) + 1).padStart(3, '0')}`,
      description: legend.impact ?? legend.summary ?? 'Explore this legend in the BitLore collection.',
      image: legend.portrait?.src,
    }))
}

export function getHomepageStats() {
  const historicalSpan =
    collectionMeta.earliestYear && collectionMeta.latestYear
      ? `${collectionMeta.latestYear - collectionMeta.earliestYear}+ years`
      : 'Collection-wide span'

  return [
    { value: String(legendIndex.length), label: 'Legendary Profiles' },
    { value: String(generatedCategories.length), label: 'Domains of Inquiry' },
    { value: `${collectionMeta.totalResources}+`, label: 'Archival References' },
    { value: historicalSpan, label: 'Of Computing History' },
  ]
}
