import { useEffect, useMemo } from 'react'
import { seoDefaults } from '../content/seo.ts'

const STRUCTURED_DATA_ID = 'seo-structured-data'

export interface SeoProps {
  title?: string
  description?: string
  path?: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article' | 'profile'
  noIndex?: boolean
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>
}

function getAbsoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const normalizedPath = path === '/' ? '' : `/${path.replace(/^\/+/, '')}`
  return `${seoDefaults.siteUrl}${normalizedPath}`
}

function ensureMeta(attribute: 'name' | 'property', value: string) {
  let element = document.head.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement | null

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, value)
    document.head.appendChild(element)
  }

  return element
}

function ensureLink(rel: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null

  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    document.head.appendChild(element)
  }

  return element
}

export function Seo({
  title = seoDefaults.siteName,
  description = seoDefaults.description,
  path = '/',
  image = seoDefaults.image,
  imageAlt = seoDefaults.defaultImageAlt,
  type = 'website',
  noIndex = false,
  structuredData,
}: SeoProps) {
  const fullTitle = title === seoDefaults.siteName ? title : `${title} | ${seoDefaults.siteName}`
  const canonicalUrl = getAbsoluteUrl(path)
  const robots = noIndex ? 'noindex, nofollow' : 'index, follow'
  const structuredDataJson = useMemo(
    () => (structuredData ? JSON.stringify(structuredData) : undefined),
    [structuredData],
  )

  useEffect(() => {
    document.title = fullTitle
    document.documentElement.lang = 'en'

    ensureMeta('name', 'description').content = description
    ensureMeta('name', 'robots').content = robots
    ensureMeta('property', 'og:type').content = type
    ensureMeta('property', 'og:title').content = fullTitle
    ensureMeta('property', 'og:description').content = description
    ensureMeta('property', 'og:url').content = canonicalUrl
    ensureMeta('property', 'og:image').content = image
    ensureMeta('property', 'og:image:alt').content = imageAlt
    ensureMeta('property', 'og:locale').content = seoDefaults.locale
    ensureMeta('property', 'og:site_name').content = seoDefaults.siteName
    ensureMeta('name', 'twitter:card').content = 'summary_large_image'
    ensureMeta('name', 'twitter:title').content = fullTitle
    ensureMeta('name', 'twitter:description').content = description
    ensureMeta('name', 'twitter:image').content = image
    ensureMeta('name', 'twitter:image:alt').content = imageAlt
    ensureMeta('name', 'twitter:url').content = canonicalUrl
    ensureLink('canonical').href = canonicalUrl

    const existingStructuredData = document.getElementById(STRUCTURED_DATA_ID)
    if (structuredDataJson) {
      const script = existingStructuredData instanceof HTMLScriptElement
        ? existingStructuredData
        : document.createElement('script')
      script.id = STRUCTURED_DATA_ID
      script.type = 'application/ld+json'
      script.text = structuredDataJson
      if (!existingStructuredData) {
        document.head.appendChild(script)
      }
    } else {
      existingStructuredData?.remove()
    }
  }, [canonicalUrl, description, fullTitle, image, imageAlt, robots, structuredDataJson, type])

  return null
}
