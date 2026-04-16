import { categories as generatedCategories } from './generated/categories.generated'
import { collectionMeta } from './generated/collection-meta.generated'
import { legendIndex } from './generated/legend-index.generated'
import type { CategoryId } from './types'

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
      image: legend.portrait,
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