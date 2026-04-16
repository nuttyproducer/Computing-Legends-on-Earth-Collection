import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { ResponsiveImage } from '../components/ResponsiveImage.tsx'
import { Seo } from '../components/Seo.tsx'
import { ScrollLink } from '../components/ScrollLink.tsx'
import { homeHeroImage, resolveAbsoluteAssetUrl } from '../content/assets.ts'
import {
  fadeUp,
  getHomepageCategories,
  getHomepageFeaturedLegends,
  getHomepageStats,
  personaPromises,
} from '../content/home-presentation'
import { seoDefaults } from '../content/seo.ts'

export function HomePage() {
  const categories = getHomepageCategories()
  const featuredLegends = getHomepageFeaturedLegends()
  const stats = getHomepageStats()
  const description = 'Explore the computing pioneers, theorists, systems builders, AI researchers, and internet architects who shaped the digital age.'
  const imageAlt = 'A dramatic archive-style hero image introducing Computing Legends on Earth'
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${seoDefaults.siteUrl}#website`,
      name: seoDefaults.siteName,
      url: seoDefaults.siteUrl,
      description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${seoDefaults.siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': seoDefaults.siteUrl,
      name: seoDefaults.siteName,
      url: seoDefaults.siteUrl,
      description,
      isPartOf: { '@id': `${seoDefaults.siteUrl}#website` },
      about: {
        '@type': 'Thing',
        name: 'Computing history',
        description: 'A curated survey of computing pioneers, systems builders, AI researchers, and web architects.',
      },
      hasPart: categories.map((category) => ({
        '@type': 'CollectionPage',
        name: category.name,
        url: `${seoDefaults.siteUrl}/category/${category.id}`,
        description: category.description,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${seoDefaults.siteUrl}#categories`,
      name: 'Exhibit wings',
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${seoDefaults.siteUrl}/category/${category.id}`,
        name: category.name,
        description: category.description,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${seoDefaults.siteUrl}#featured-legends`,
      name: 'Featured legends',
      numberOfItems: featuredLegends.length,
      itemListElement: featuredLegends.map((legend, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${seoDefaults.siteUrl}/legend/${legend.slug}`,
        name: legend.name,
        image: resolveAbsoluteAssetUrl(legend.image?.src),
        description: legend.description,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      '@id': `${seoDefaults.siteUrl}#dataset`,
      name: `${seoDefaults.siteName} collection metadata`,
      description: 'Collection-level metadata for the public computing legends archive.',
      url: `${seoDefaults.siteUrl}/data/legend-details.generated.json`,
      includedInDataCatalog: {
        '@type': 'DataCatalog',
        name: seoDefaults.siteName,
        url: seoDefaults.siteUrl,
      },
      keywords: stats.map((stat) => stat.label),
    },
  ]

  return (
    <>
      <Seo
        title={seoDefaults.siteName}
        description={description}
        path="/"
        imageAlt={imageAlt}
        structuredData={structuredData}
      />
      <main id="home">
        <section className="hero-section">
          <div className="hero-backdrop" aria-hidden="true">
            <ResponsiveImage
              image={homeHeroImage}
              alt=""
              sizes="(max-width: 768px) 100vw, 58vw"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
            <div className="hero-gradient" />
          </div>

          <div className="container hero-grid">
            <motion.div className="hero-copy" {...fadeUp}>
              <p className="eyebrow">The Living Archive Presents</p>
              <h1>
                The Architects of the <span>Digital Age</span>
              </h1>
              <p className="hero-summary">
                A museum-style knowledge base for exploring some of the greatest legends who shaped
                computing — from mechanical engines and formal logic to compilers,
                artificial intelligence, and the web.
              </p>

              <div className="hero-actions">
                <ScrollLink className="button-primary" to="/category/pioneers">
                  Start Exploring
                  <ArrowRight size={18} />
                </ScrollLink>
                <a className="button-secondary" href="#featured">
                  Featured Legends
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <motion.section className="promise-section" {...fadeUp}>
          <div className="container promise-grid">
            <div>
              <p className="eyebrow">Why this exists</p>
              <h2>A living archive built for curiosity, context, and discovery.</h2>
            </div>

            <div className="persona-list">
              {personaPromises.map((item) => (
                <article key={item.title} className="promise-card">
                  <Sparkles size={18} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="domains-section" id="domains">
          <div className="container">
            <motion.div className="section-heading" {...fadeUp}>
              <p className="eyebrow">Domains of Inquiry</p>
              <h2>Traverse computing history through six curated domains.</h2>
              <p>
                Each domain acts like an exhibit wing, connecting breakthroughs,
                biographies, and the evolution of ideas across generations.
              </p>
            </motion.div>

            <div className="domain-grid">
              {categories.map((category, index) => (
                <motion.article
                  key={category.id}
                  className="domain-card"
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.05 }}
                >
                  <span className="domain-era">{category.era}</span>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <p className="domain-count">{category.count} legends in this wing</p>
                  <ScrollLink to={`/category/${category.id}`}>
                    Open Exhibit
                    <ArrowRight size={16} />
                  </ScrollLink>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="featured-section" id="featured">
          <div className="container">
            <motion.div className="section-heading centered" {...fadeUp}>
              <p className="eyebrow">Start Here</p>
              <h2>Three legends that open the collection from different eras.</h2>
            </motion.div>

            <div className="featured-grid">
              {featuredLegends.map((legend, index) => (
                <motion.article
                  key={legend.name}
                  className={`legend-card${index === 1 ? ' legend-card-offset' : ''}`}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.08 }}
                >
                  <ScrollLink className="portrait-link" to={`/legend/${legend.slug}`} aria-label={`Open ${legend.name} biography`}>
                    <div className="legend-image-frame">
                      <ResponsiveImage
                        className="portrait-image"
                        image={legend.image}
                        alt={legend.name}
                        sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1200px) 33vw, 380px"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="legend-image-border" />
                    </div>
                  </ScrollLink>
                  <div className="legend-body">
                    <div className="legend-meta legend-meta-stacked">
                      <div className="legend-meta-primary">
                        <span className="legend-years">{legend.years}</span>
                      </div>
                      <div className="legend-meta-tags">
                        <span className="archive-pill">{legend.archiveNo}</span>
                      </div>
                    </div>
                    <h3>
                      <ScrollLink className="card-title-link" to={`/legend/${legend.slug}`}>
                        {legend.name}
                      </ScrollLink>
                    </h3>
                    <p>{legend.description}</p>
                    <ScrollLink to={`/legend/${legend.slug}`}>View Biography</ScrollLink>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <motion.section className="stats-section" {...fadeUp}>
          <div className="container stats-layout">
            <div className="stats-copy">
              <p className="eyebrow">Collection Snapshot</p>
              <h2>A curated history spanning mechanical logic, software, and intelligent machines.</h2>
            </div>

            <div className="stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-block">
                  <span>{stat.value}</span>
                  <small>{stat.label}</small>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </>
  )
}
