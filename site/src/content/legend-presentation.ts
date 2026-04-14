import { legendIndex } from './generated'
import type { CategoryId, LegendDetail, RenderableSectionKind } from './types'
import { extractBulletItems, extractParagraphs, summarizeMarkdown } from './presentation'

let detailMapPromise: Promise<Record<string, LegendDetail>> | undefined

async function loadLegendDetailMap() {
  if (!detailMapPromise) {
    detailMapPromise = fetch(`${import.meta.env.BASE_URL}data/legend-details.generated.json`).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load legend details: ${response.status}`)
      }

      return (await response.json()) as Record<string, LegendDetail>
    })
  }

  return detailMapPromise
}

export async function loadLegendDetail(slug: string) {
  const detailMap = await loadLegendDetailMap()
  return detailMap[slug]
}

export function getSection(detail: LegendDetail, kind: RenderableSectionKind) {
  return detail.sections.find((section) => section.kind === kind)
}

export function getSectionParagraphs(detail: LegendDetail, kind: RenderableSectionKind, maxParagraphs = 3) {
  const section = getSection(detail, kind)
  return extractParagraphs(section?.markdown, maxParagraphs)
}

export function getSectionBullets(detail: LegendDetail, kind: RenderableSectionKind, maxItems = 6) {
  const section = getSection(detail, kind)
  return extractBulletItems(section?.markdown, maxItems)
}

export function getSubsectionCards(detail: LegendDetail, kind: RenderableSectionKind, maxCards = 4) {
  const section = getSection(detail, kind)

  if (!section?.subsections?.length) {
    return []
  }

  return section.subsections.slice(0, maxCards).map((subsection) => ({
    id: subsection.id,
    title: subsection.title,
    summary: summarizeMarkdown(subsection.markdown, 260) ?? 'Section captured for expanded museum treatment.',
    bullets: extractBulletItems(subsection.markdown, 3),
  }))
}

export function getRelatedLegendEntries(detail: LegendDetail, categoryId?: CategoryId) {
  return detail.relatedSlugs
    .map((slug) => legendIndex.find((entry) => entry.slug === slug))
    .filter((entry) => !categoryId || entry?.category === categoryId)
}