import { categories as generatedCategories } from './generated/categories.generated'
import { legendIndex } from './generated/legend-index.generated'
import type { CategoryId } from './types'

function normalizeSearchText(value?: string) {
  return value?.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim() ?? ''
}

export function getSearchTerms(query?: string) {
  return normalizeSearchText(query)
    .split(' ')
    .filter(Boolean)
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