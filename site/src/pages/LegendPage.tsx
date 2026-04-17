import { PlayCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useParams } from 'react-router-dom'
import { ResponsiveImage } from '../components/ResponsiveImage.tsx'
import { Seo } from '../components/Seo.tsx'
import { ScrollLink } from '../components/ScrollLink.tsx'
import { resolveAbsoluteAssetUrl } from '../content/assets.ts'
import { loadLegendDetail } from '../content/legend-presentation'
import { seoDefaults } from '../content/seo.ts'
import { extractYears, formatCompactLifespan } from '../content/text-utils'
import type { LegendDetail } from '../content/types'
import { NotFoundPage } from './NotFoundPage'

function isVideoHref(href: string) {
  return /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(href)
}

function isInternalHref(href: string) {
  return href.startsWith('/') && !href.startsWith('//')
}

function MarkdownBlock({ markdown }: { markdown: string }) {
  const cleanedMarkdown = useMemo(
    () => markdown
      .replace(/^(?:\s*<img[^>]*>\s*)+/gi, '')
      .replace(/^(?:\s*!\[[^\]]*\]\([^)]+\)\s*)+/g, '')
      .replace(/<br\s+clear="left"\s*\/?>/gi, '')
      .trim(),
    [markdown],
  )

  return (
    <div className="markdown-reader">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => (
            isInternalHref(href ?? '') ? (
              <ScrollLink
                {...props}
                to={href ?? '/'}
                className={isVideoHref(href ?? '') ? 'markdown-video-link' : undefined}
              >
                {isVideoHref(href ?? '') ? <PlayCircle size={16} aria-hidden="true" /> : null}
                {children}
              </ScrollLink>
            ) : (
              <a
                {...props}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={isVideoHref(href ?? '') ? 'markdown-video-link' : undefined}
              >
                {isVideoHref(href ?? '') ? <PlayCircle size={16} aria-hidden="true" /> : null}
                {children}
              </a>
            )
          ),
        }}
      >
        {cleanedMarkdown}
      </ReactMarkdown>
    </div>
  )
}

function getLegendStructuredData(legend: LegendDetail, description: string) {
  const canonicalUrl = `${seoDefaults.siteUrl}/legend/${legend.slug}`
  const personId = `${canonicalUrl}#person`
  const breadcrumbId = `${canonicalUrl}#breadcrumb`
  const imageUrls = legend.images.map((image) => resolveAbsoluteAssetUrl(image.src)).filter(Boolean)
  const sameAs = [...new Set([
    ...legend.resources.map((resource) => resource.url).filter(Boolean),
    ...legend.references.map((reference) => reference.url).filter(Boolean),
  ])].slice(0, 12)
  const knowsAbout = [...new Set([
    ...legend.tags,
    ...(legend.field?.split(',').map((item) => item.trim()).filter(Boolean) ?? []),
  ])]
  const awards = legend.awards
    .map((award) => award.title.trim())
    .filter(Boolean)
  const notableEvents = legend.timeline
    .map((item) => {
      const [year] = extractYears(item.year)

      if (!year) {
        return undefined
      }

      return {
        '@type': 'Event',
        name: item.event,
        startDate: String(year),
        description: item.event,
      }
    })
    .filter(Boolean)
    .slice(0, 8)

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': canonicalUrl,
      name: `${legend.name} | ${seoDefaults.siteName}`,
      url: canonicalUrl,
      description,
      breadcrumb: { '@id': breadcrumbId },
      mainEntity: { '@id': personId },
      primaryImageOfPage: imageUrls[0],
      isPartOf: {
        '@type': 'WebSite',
        name: seoDefaults.siteName,
        url: seoDefaults.siteUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: seoDefaults.siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: legend.categoryLabel,
          item: `${seoDefaults.siteUrl}/category/${legend.category}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: legend.name,
          item: canonicalUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': personId,
      name: legend.fullName ?? legend.name,
      alternateName: legend.fullName && legend.fullName !== legend.name ? legend.name : undefined,
      description,
      image: imageUrls,
      url: canonicalUrl,
      sameAs,
      knowsAbout,
      award: awards,
      hasOccupation: (legend.field?.split(',').map((item) => item.trim()).filter(Boolean) ?? []).map((item) => ({
        '@type': 'Occupation',
        name: item,
      })),
      subjectOf: notableEvents,
    },
  ]
}

export function LegendPage() {
  const { slug } = useParams<{ slug: string }>()
  const [requestState, setRequestState] = useState<{
    slug?: string
    legend?: LegendDetail
    failed: boolean
  }>({ failed: false })

  useEffect(() => {
    let active = true

    if (!slug) {
      return () => {
        active = false
      }
    }

    loadLegendDetail(slug)
      .then((detail) => {
        if (!active) {
          return
        }

        setRequestState({ slug, legend: detail, failed: !detail })
      })
      .catch(() => {
        if (!active) {
          return
        }

        setRequestState({ slug, legend: undefined, failed: true })
      })

    return () => {
      active = false
    }
  }, [slug])

  const legend = requestState.slug === slug ? requestState.legend : undefined
  const failed = requestState.slug === slug ? requestState.failed : false
  const loading = Boolean(slug) && requestState.slug !== slug

  if (!slug) {
    return (
      <NotFoundPage
        title="Unknown Legend"
        description="That legend route does not match a generated profile yet."
      />
    )
  }

  if (loading) {
    return (
      <main className="route-main route-main-centered">
        <div className="container">
          <div className="not-found-panel">
            <p className="eyebrow">Loading Profile</p>
            <h1 className="route-title">Preparing the exhibit label…</h1>
            <p className="route-summary">The archive is loading this legend from the collection vault.</p>
          </div>
        </div>
      </main>
    )
  }

  if (!legend || failed) {
    return (
      <NotFoundPage
        title="Unknown Legend"
        description="That legend route does not match a generated profile yet."
      />
    )
  }

  const readableSections = legend.sections.filter((section) => section.markdown.trim().length > 0)
  const heroLifespan = formatCompactLifespan(legend.lifespan)
  const description = legend.impact ?? legend.summary ?? `${legend.name} is part of the ${legend.categoryLabel} collection.`
  const structuredData = getLegendStructuredData(legend, description)

  return (
    <>
      <Seo
        title={legend.name}
        description={description}
        path={`/legend/${legend.slug}`}
        image={legend.portrait?.src ?? seoDefaults.image}
        imageAlt={legend.portrait?.alt ? `${legend.portrait.alt} of ${legend.name}` : `Portrait of ${legend.name}`}
        type="profile"
        structuredData={structuredData}
      />
      <main className="route-main">
        <section className="route-hero legend-hero">
          <div className="container legend-shell-grid">
            <div className="route-copy">
              <p className="eyebrow">Legend Profile</p>
              <p className="route-breadcrumb">
                <ScrollLink to="/">Home</ScrollLink>
                <span>/</span>
                <ScrollLink to={`/category/${legend.category}`}>{legend.categoryLabel}</ScrollLink>
                <span>/</span>
                <span>{legend.name}</span>
              </p>
              <h1 className="route-title">{legend.name}</h1>
              <p className="route-summary">{legend.impact ?? legend.summary ?? 'Profile shell ready for long-form museum storytelling.'}</p>

              <div className="shell-chip-list">
                {legend.field ? <span className="archive-pill">{legend.field}</span> : null}
                {heroLifespan ? <span className="legend-years">{heroLifespan}</span> : null}
              </div>
            </div>

            <aside className="legend-portrait-panel">
              {legend.portrait ? (
                <ResponsiveImage
                  image={legend.portrait}
                  alt={legend.name}
                  sizes="(max-width: 768px) calc(100vw - 2rem), 26rem"
                  loading="eager"
                  decoding="async"
                />
              ) : <div className="exhibit-image-fallback" />}
            </aside>
          </div>
        </section>

        <section className="route-section">
          <div className="container legend-reader-layout">
            <article className="info-panel legend-reader-panel">
              {legend.leadMarkdown?.trim() ? (
                <section className="reader-section reader-lead-section">
                  <MarkdownBlock markdown={legend.leadMarkdown} />
                </section>
              ) : null}

              {readableSections.map((section) => (
                <section key={section.id} className="reader-section">
                  <p className="eyebrow">{section.title}</p>
                  <MarkdownBlock markdown={section.markdown} />
                </section>
              ))}
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
