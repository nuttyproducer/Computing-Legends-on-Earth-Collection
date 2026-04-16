import { seoDefaults } from './seo.ts'
import type { ResponsiveImageAsset, ResponsiveImageSource } from './types.ts'

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

export function resolveAssetUrl(value?: string) {
  if (!value) {
    return value
  }

  if (isAbsoluteUrl(value)) {
    return value
  }

  const normalizedValue = value.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${normalizedValue}`
}

export function resolveAbsoluteAssetUrl(value?: string) {
  if (!value) {
    return value
  }

  if (isAbsoluteUrl(value)) {
    return value
  }

  const normalizedValue = value.replace(/^\/+/, '')
  return `${seoDefaults.siteUrl}/${normalizedValue}`
}

export function resolveAssetSrcSet(sources?: ResponsiveImageSource[], absolute = false) {
  if (!sources || sources.length === 0) {
    return undefined
  }

  return sources
    .map((source) => {
      const resolvedUrl = absolute ? resolveAbsoluteAssetUrl(source.src) : resolveAssetUrl(source.src)
      return resolvedUrl ? `${resolvedUrl} ${source.width}w` : undefined
    })
    .filter(Boolean)
    .join(', ')
}

export const homeHeroImage: ResponsiveImageAsset = {
  src: 'images/landing/hero/hero-digital-age-archive.jpg',
  width: 512,
  height: 512,
  sources: [
    {
      src: 'images/landing/hero/generated/hero-digital-age-archive-320w.webp',
      width: 320,
      height: 320,
      type: 'image/webp',
    },
    {
      src: 'images/landing/hero/generated/hero-digital-age-archive-512w.webp',
      width: 512,
      height: 512,
      type: 'image/webp',
    },
  ],
}
