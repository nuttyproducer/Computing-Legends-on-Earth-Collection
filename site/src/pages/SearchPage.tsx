import { Search as SearchIcon } from 'lucide-react'
import type { KeyboardEvent, ReactNode } from 'react'
import { useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ResponsiveImage } from '../components/ResponsiveImage.tsx'
import { Seo } from '../components/Seo.tsx'
import { ScrollLink } from '../components/ScrollLink.tsx'
import { resolveAbsoluteAssetUrl } from '../content/assets.ts'
import {
  getSearchCategoryOptions,
  getSearchSuggestions,
  getSearchTerms,
  searchLegends,
} from '../content/search-presentation'
import { seoDefaults } from '../content/seo.ts'
import { summarizeMarkdown } from '../content/text-utils'
import type { CategoryId } from '../content/types'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlightText(text: string, terms: string[]) {
  if (!text || terms.length === 0) {
    return text
  }

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'ig')
  const parts = text.split(pattern).filter(Boolean)

  return parts.map((part, index) => {
    const isMatch = terms.some((term) => part.toLowerCase() === term.toLowerCase())
    return isMatch ? <mark key={`${part}-${index}`}>{part}</mark> : <span key={`${part}-${index}`}>{part}</span>
  })
}

function matchesTerm(text: string | undefined, terms: string[]) {
  if (!text || terms.length === 0) {
    return false
  }

  const normalizedText = text.toLowerCase()
  return terms.some((term) => normalizedText.includes(term))
}

function focusElement<T extends HTMLElement>(refs: Array<T | null>, index: number) {
  refs[index]?.focus()
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const suggestionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const filterRefs = useRef<Array<HTMLButtonElement | null>>([])
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const query = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? 'all'

  const categories = getSearchCategoryOptions()
  const selectedCategory = category === 'all' ? 'all' : (category as CategoryId)
  const terms = useMemo(() => getSearchTerms(query), [query])
  const results = useMemo(
    () => searchLegends(query, selectedCategory),
    [query, selectedCategory],
  )
  const suggestions = useMemo(() => getSearchSuggestions(selectedCategory, query), [selectedCategory, query])
  const promptSuggestions = query.trim().length === 0 ? suggestions.slice(0, 6) : []
  const emptySuggestions = query.trim().length > 0 && results.length === 0 ? suggestions : []
  const activeSuggestions = promptSuggestions.length > 0 ? promptSuggestions : emptySuggestions

  const resultLabel = query.trim().length > 0 ? `Results for “${query.trim()}”` : 'Browse the full archive'
  const title = query.trim().length > 0 ? `Search: ${query.trim()}` : 'Search the Archive'
  const description = query.trim().length > 0
    ? `Search results for ${query.trim()} across the ${seoDefaults.siteName} collection.`
    : 'Search across names, domains, contributions, and exhibit wings in the Computing Legends on Earth archive.'
  const socialImage = resolveAbsoluteAssetUrl(results.find((legend) => legend.portrait)?.portrait?.src) ?? seoDefaults.image
  const socialImageAlt = query.trim().length > 0
    ? `Search results preview for ${query.trim()} in ${seoDefaults.siteName}`
    : 'Archive search preview image for Computing Legends on Earth'
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      '@id': `${seoDefaults.siteUrl}/search`,
      name: `${title} | ${seoDefaults.siteName}`,
      url: `${seoDefaults.siteUrl}/search`,
      description,
      isPartOf: {
        '@type': 'WebSite',
        name: seoDefaults.siteName,
        url: seoDefaults.siteUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${seoDefaults.siteUrl}/search#breadcrumb`,
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
          name: 'Search',
          item: `${seoDefaults.siteUrl}/search`,
        },
      ],
    },
  ]

  const applySuggestion = (value: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('q', value)
    setSearchParams(next, { replace: true })
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'ArrowDown') {
      return
    }

    event.preventDefault()

    if (activeSuggestions.length > 0) {
      focusElement(suggestionRefs.current, 0)
      return
    }

    if (filterRefs.current[0]) {
      focusElement(filterRefs.current, 0)
      return
    }

    focusElement(resultRefs.current, 0)
  }

  const handleSuggestionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusElement(suggestionRefs.current, Math.min(index + 1, activeSuggestions.length - 1))
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusElement(suggestionRefs.current, Math.max(index - 1, 0))
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusElement(filterRefs.current, 0)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      inputRef.current?.focus()
    }

    if (event.key === 'Home') {
      event.preventDefault()
      focusElement(suggestionRefs.current, 0)
    }

    if (event.key === 'End') {
      event.preventDefault()
      focusElement(suggestionRefs.current, activeSuggestions.length - 1)
    }
  }

  const handleFilterKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusElement(filterRefs.current, Math.min(index + 1, categories.length - 1))
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusElement(filterRefs.current, Math.max(index - 1, 0))
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (activeSuggestions.length > 0) {
        focusElement(suggestionRefs.current, activeSuggestions.length - 1)
      } else {
        inputRef.current?.focus()
      }
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusElement(resultRefs.current, 0)
    }

    if (event.key === 'Home') {
      event.preventDefault()
      focusElement(filterRefs.current, 0)
    }

    if (event.key === 'End') {
      event.preventDefault()
      focusElement(filterRefs.current, categories.length - 1)
    }
  }

  const handleResultKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      focusElement(resultRefs.current, Math.min(index + 1, results.length - 1))
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      if (index === 0) {
        focusElement(filterRefs.current, categories.length - 1)
        return
      }

      focusElement(resultRefs.current, Math.max(index - 1, 0))
    }

    if (event.key === 'Home') {
      event.preventDefault()
      focusElement(resultRefs.current, 0)
    }

    if (event.key === 'End') {
      event.preventDefault()
      focusElement(resultRefs.current, results.length - 1)
    }
  }

  const renderSuggestionChips = (items: string[]): ReactNode => (
    <div className="suggestion-chip-row">
      {items.map((item, index) => (
        <button
          key={item}
          ref={(element) => {
            suggestionRefs.current[index] = element
          }}
          type="button"
          className="suggestion-chip"
          onClick={() => applySuggestion(item)}
          onKeyDown={(event) => handleSuggestionKeyDown(event, index)}
        >
          {item}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <Seo
        title={title}
        description={description}
        path="/search"
        image={socialImage}
        imageAlt={socialImageAlt}
        noIndex
        structuredData={structuredData}
      />
      <main className="route-main">
      <section className="route-hero">
        <div className="container route-hero-layout">
          <div className="route-copy">
            <p className="eyebrow">Search the Archive</p>
            <p className="route-breadcrumb">
              <ScrollLink to="/">Home</ScrollLink>
              <span>/</span>
              <span>Search</span>
            </p>
            <h1 className="route-title">Find legends, fields, and exhibit threads.</h1>
            <p className="route-summary">
              Search across names, domains, contributions, and tags. Then narrow the archive by exhibit wing.
            </p>
          </div>

          <aside className="route-meta-panel search-meta-panel">
            <div className="route-stat">
              <span>{results.length}</span>
              <small>Matching profiles</small>
            </div>
            <div className="route-stat">
              <span>{categories.length - 1}</span>
              <small>Exhibit wings</small>
            </div>
          </aside>
        </div>
      </section>

      <section className="route-section">
        <div className="container search-layout">
          <section className="info-panel info-panel-wide search-controls-panel">
            <div className="search-input-wrap">
              <SearchIcon size={18} />
              <input
                ref={inputRef}
                className="search-input"
                type="search"
                placeholder="Search Ada, compilers, neural networks, hypertext…"
                value={query}
                onKeyDown={handleInputKeyDown}
                onChange={(event) => {
                  const next = new URLSearchParams(searchParams)
                  if (event.target.value) {
                    next.set('q', event.target.value)
                  } else {
                    next.delete('q')
                  }
                  setSearchParams(next, { replace: true })
                }}
              />
            </div>

            {promptSuggestions.length > 0 ? (
              <div className="search-suggestion-block">
                <p className="eyebrow">Try a Prompt</p>
                {renderSuggestionChips(promptSuggestions)}
              </div>
            ) : null}

            <div className="filter-chip-row" role="tablist" aria-label="Filter by category">
              {categories.map((option, index) => {
                const active = option.id === category
                return (
                  <button
                    key={option.id}
                    ref={(element) => {
                      filterRefs.current[index] = element
                    }}
                    type="button"
                    className={`filter-chip${active ? ' is-active' : ''}`}
                    onKeyDown={(event) => handleFilterKeyDown(event, index)}
                    onClick={() => {
                      const next = new URLSearchParams(searchParams)
                      if (option.id === 'all') {
                        next.delete('category')
                      } else {
                        next.set('category', option.id)
                      }
                      setSearchParams(next, { replace: true })
                    }}
                    aria-pressed={active}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </section>

          <div className="search-results-head">
            <div>
              <p className="eyebrow">Collection Results</p>
              <h2 className="panel-title">{resultLabel}</h2>
            </div>
            <p className="search-result-meta">
              {results.length} {results.length === 1 ? 'profile' : 'profiles'} visible
            </p>
          </div>

          {results.length > 0 ? (
            <div className="exhibit-grid">
              {results.map((legend, index) => (
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
                      {legend.field || legend.tags.length > 0 ? (
                        <div className="legend-meta-tags">
                          {legend.field ? <span className="archive-pill">{highlightText(legend.field, terms)}</span> : null}
                          {legend.tags
                            .filter((tag) => matchesTerm(tag, terms))
                            .slice(0, 2)
                            .map((tag) => (
                              <span key={tag} className="search-match-pill">
                                {highlightText(tag, terms)}
                              </span>
                            ))}
                        </div>
                      ) : null}
                    </div>
                    <h3>
                      <ScrollLink className="card-title-link" to={`/legend/${legend.slug}`}>
                        {highlightText(legend.name, terms)}
                      </ScrollLink>
                    </h3>
                    <p>{highlightText(legend.impact ?? legend.summary ?? 'Explore this profile in the archive.', terms)}</p>
                    {legend.summary ? <p className="card-secondary-copy">{highlightText(summarizeMarkdown(legend.summary, 170) ?? '', terms)}</p> : null}
                    <ScrollLink
                      ref={(element) => {
                        resultRefs.current[index] = element
                      }}
                      className="search-result-link"
                      to={`/legend/${legend.slug}`}
                      onKeyDown={(event) => handleResultKeyDown(event, index)}
                    >
                      Open Biography
                    </ScrollLink>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="not-found-panel search-empty-panel">
              <p className="eyebrow">No Match Yet</p>
              <h2 className="panel-title">Try a broader name, field, or tag.</h2>
              <p className="route-summary">
                Search works across legend names, category labels, fields, impact notes, and archive tags.
              </p>
              {emptySuggestions.length > 0 ? (
                <div className="search-suggestion-block search-empty-suggestions">
                  <p className="search-helper-copy">
                    Suggested starting points for {selectedCategory === 'all' ? 'the full archive' : 'this exhibit wing'}:
                  </p>
                  {renderSuggestionChips(emptySuggestions)}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>
      </main>
    </>
  )
}