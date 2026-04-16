export const CATEGORY_IDS = [
  'pioneers',
  'foundational-cs',
  'systems-languages',
  'ai-pioneers',
  'modern-ai-ml',
  'web-internet',
] as const

export type CategoryId = (typeof CATEGORY_IDS)[number]

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  pioneers: 'Pioneers',
  'foundational-cs': 'Foundational Computer Science',
  'systems-languages': 'Systems & Languages',
  'ai-pioneers': 'AI Pioneers',
  'modern-ai-ml': 'Modern AI & ML',
  'web-internet': 'Web & Internet',
}

export const SECTION_KINDS = [
  'quick-facts',
  'biography',
  'contributions',
  'publications',
  'awards',
  'quotes',
  'influence',
  'related-figures',
  'resources',
  'timeline',
  'references',
  'navigation',
  'custom-markdown',
] as const

export type RenderableSectionKind = (typeof SECTION_KINDS)[number]

export type SourceMetadataLabel =
  | 'field'
  | 'full-name'
  | 'lifespan'
  | 'born'
  | 'died'
  | 'nationality'
  | 'key-contribution'
  | 'impact'
  | 'turing-award'
  | 'other'

export type LinkKind = 'internal' | 'external'

export type ResourceKind =
  | 'primary-source'
  | 'biography'
  | 'documentary'
  | 'technical-resource'
  | 'interview'
  | 'talk'
  | 'archive'
  | 'article'
  | 'book'
  | 'other'

export type MediaKind =
  | 'video'
  | 'documentary'
  | 'interview'
  | 'talk'
  | 'audio'
  | 'archive'
  | 'other'

export interface SourceLocation {
  sourcePath: string
  category: CategoryId
  slug: string
}

export interface ResponsiveImageSource {
  src: string
  width: number
  height: number
  type: string
}

export interface ResponsiveImageAsset {
  src: string
  width?: number
  height?: number
  sources?: ResponsiveImageSource[]
}

export interface LegendImage extends ResponsiveImageAsset {
  alt: string
  caption?: string
  credit?: string
  isPortrait?: boolean
}

export interface QuickFactItem {
  label: string
  normalizedLabel: SourceMetadataLabel
  value: string
}

export interface QuoteItem {
  text: string
  attribution?: string
  context?: string
}

export interface TimelineItem {
  year: string
  event: string
}

export interface AwardItem {
  year?: string
  title: string
  organization?: string
  reason?: string
  rawCells?: string[]
}

export interface LegendLink {
  label: string
  href: string
  kind: LinkKind
  resolvedSlug?: string
}

export interface RelatedFigure {
  name: string
  href: string
  resolvedSlug?: string
  relationship?: string
}

export interface ResourceItem {
  title: string
  url?: string
  description?: string
  sectionTitle?: string
  kind: ResourceKind
  host?: string
  isEmbeddable?: boolean
}

export interface MediaItem {
  title: string
  url?: string
  description?: string
  sourceSectionTitle?: string
  kind: MediaKind
  provider?: string
  embedUrl?: string
  thumbnailUrl?: string
  isEmbeddable: boolean
}

export interface NavigationLink {
  label: string
  href: string
  resolvedSlug?: string
  direction: 'main-index' | 'category-overview' | 'previous' | 'next' | 'other'
}

export interface ReferenceItem {
  text: string
  url?: string
}

export interface RenderableSubsection {
  id: string
  title: string
  markdown: string
}

export interface RenderableSection {
  id: string
  kind: RenderableSectionKind
  title: string
  markdown: string
  subsections?: RenderableSubsection[]
}

export interface LegendIndexEntry extends SourceLocation {
  id: string
  name: string
  categoryLabel: string
  portrait?: LegendImage
  lifespan?: string
  field?: string
  keyContribution?: string
  impact?: string
  summary?: string
  tags: string[]
  relatedSlugs: string[]
  featured?: boolean
}

export interface LegendDetail extends LegendIndexEntry {
  fullName?: string
  leadMarkdown?: string
  introQuote?: QuoteItem
  quickFacts: QuickFactItem[]
  sections: RenderableSection[]
  awards: AwardItem[]
  quotes: QuoteItem[]
  timeline: TimelineItem[]
  relatedFigures: RelatedFigure[]
  resources: ResourceItem[]
  mediaItems: MediaItem[]
  references: ReferenceItem[]
  navigation: NavigationLink[]
  images: LegendImage[]
}

export interface CategorySummary {
  id: CategoryId
  label: string
  description?: string
  count: number
  featuredSlugs: string[]
}

export interface GeneratedLegendContent {
  categories: CategorySummary[]
  legendIndex: LegendIndexEntry[]
  legendDetails: Record<string, LegendDetail>
}