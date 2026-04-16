import { ArrowRight } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { ResponsiveImage } from '../components/ResponsiveImage.tsx'
import { Seo } from '../components/Seo.tsx'
import { ScrollLink } from '../components/ScrollLink.tsx'
import { resolveAbsoluteAssetUrl } from '../content/assets.ts'
import { categoryPresentation } from '../content/home-presentation'
import { categories } from '../content/generated/categories.generated'
import { legendIndex } from '../content/generated/legend-index.generated'
import { seoDefaults } from '../content/seo.ts'
import { summarizeMarkdown } from '../content/text-utils'
import { NotFoundPage } from './NotFoundPage'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const category = categories.find((item) => item.id === slug)

  if (!category) {
    return (
      <NotFoundPage
        title="Unknown Exhibit Wing"
        description="That category route does not map to a known collection wing yet."
      />
    )
  }

  const presentation = categoryPresentation[category.id]
  const legends = legendIndex.filter((legend) => legend.category === category.id)
  const legendsWithPortraits = legends.filter((legend) => legend.portrait).length
  const description = `${presentation.description} Explore ${category.count} legends in the ${category.label} exhibit wing.`
  const socialLegend = legends.find((legend) => legend.portrait)
  const image = resolveAbsoluteAssetUrl(socialLegend?.portrait?.src) ?? seoDefaults.image
  const imageAlt = socialLegend?.portrait?.alt
    ? `${socialLegend.portrait.alt} — featured in the ${category.label} exhibit wing`
    : `${category.label} exhibit wing preview image`
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${seoDefaults.siteUrl}/category/${category.id}`,
      name: `${category.label} | ${seoDefaults.siteName}`,
      url: `${seoDefaults.siteUrl}/category/${category.id}`,
      description,
      isPartOf: {
        '@type': 'WebSite',
        name: seoDefaults.siteName,
        url: seoDefaults.siteUrl,
      },
      about: {
        '@type': 'Thing',
        name: category.label,
        description: presentation.description,
      },
      primaryImageOfPage: image,
      hasPart: legends.map((legend) => ({
        '@type': 'ProfilePage',
        name: legend.name,
        url: `${seoDefaults.siteUrl}/legend/${legend.slug}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${seoDefaults.siteUrl}/category/${category.id}#breadcrumb`,
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
          name: category.label,
          item: `${seoDefaults.siteUrl}/category/${category.id}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${seoDefaults.siteUrl}/category/${category.id}#legends`,
      name: `${category.label} legends`,
      numberOfItems: legends.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: legends.map((legend, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${seoDefaults.siteUrl}/legend/${legend.slug}`,
        name: legend.name,
        image: resolveAbsoluteAssetUrl(legend.portrait?.src),
        description: legend.impact ?? legend.summary,
      })),
    },
  ]

  return (
    <>
      <Seo
        title={category.label}
        description={description}
        path={`/category/${category.id}`}
        image={image}
        imageAlt={imageAlt}
        structuredData={structuredData}
      />
      <main className="route-main">
        <section className="route-hero">
          <div className="container route-hero-layout">
            <div className="route-copy">
              <p className="eyebrow">Exhibit Wing</p>
              <p className="route-breadcrumb">
                <ScrollLink to="/">Home</ScrollLink>
                <span>/</span>
                <span>{category.label}</span>
              </p>
              <h1 className="route-title">{category.label}</h1>
              <p className="route-summary">{presentation.description}</p>
            </div>

            <aside className="route-meta-panel">
              <div className="route-stat">
                <span>{category.count}</span>
                <small>Legends in this wing</small>
              </div>
              <div className="route-stat">
                <span>{presentation.era}</span>
                <small>Curatorial lens</small>
              </div>
              <div className="route-stat">
                <span>{legendsWithPortraits}</span>
                <small>Portrait exhibits ready</small>
              </div>
            </aside>
          </div>
        </section>

        <section className="route-section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Collection Index</p>
              <h2>Browse every legend in this exhibit wing.</h2>
            </div>

            <div className="exhibit-grid">
              {legends.map((legend) => (
                <article key={legend.slug} className="exhibit-card">
                  <ScrollLink className="portrait-link" to={`/legend/${legend.slug}`} aria-label={`Open ${legend.name} biography`}>
                    <div className="exhibit-image-frame">
                      {legend.portrait ? (
                        <ResponsiveImage
                          className="portrait-image"
                          image={legend.portrait}
                          alt={legend.name}
                          sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1200px) 50vw, 380px"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : <div className="exhibit-image-fallback" />}
                    </div>
                  </ScrollLink>
                  <div className="exhibit-body">
                    <div className="legend-meta legend-meta-stacked">
                      {legend.lifespan ? (
                        <div className="legend-meta-primary">
                          <span className="legend-years">{legend.lifespan}</span>
                        </div>
                      ) : null}
                      {legend.field ? (
                        <div className="legend-meta-tags">
                          <span className="archive-pill">{legend.field}</span>
                        </div>
                      ) : null}
                    </div>
                    <h3>
                      <ScrollLink className="card-title-link" to={`/legend/${legend.slug}`}>
                        {legend.name}
                      </ScrollLink>
                    </h3>
                    <p>{legend.impact ?? legend.summary ?? 'Profile shell ready for deeper museum treatment.'}</p>
                    {legend.summary ? <p className="card-secondary-copy">{summarizeMarkdown(legend.summary, 180)}</p> : null}
                    <ScrollLink to={`/legend/${legend.slug}`}>
                      Open Biography
                      <ArrowRight size={16} />
                    </ScrollLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
