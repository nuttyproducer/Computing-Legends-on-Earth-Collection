import type { ComponentPropsWithoutRef } from 'react'
import { resolveAssetSrcSet, resolveAssetUrl } from '../content/assets.ts'
import type { ResponsiveImageAsset } from '../content/types.ts'

interface ResponsiveImageProps extends Omit<ComponentPropsWithoutRef<'img'>, 'src'> {
  image?: ResponsiveImageAsset
  sizes?: string
}

function groupSourcesByType(image?: ResponsiveImageAsset) {
  if (!image?.sources || image.sources.length === 0) {
    return []
  }

  return [...image.sources.reduce((groups, source) => {
    const existingGroup = groups.get(source.type) ?? []
    existingGroup.push(source)
    groups.set(source.type, existingGroup)
    return groups
  }, new Map<string, NonNullable<ResponsiveImageAsset['sources']>>()).entries()]
}

export function ResponsiveImage({ image, sizes, alt = '', ...imgProps }: ResponsiveImageProps) {
  if (!image) {
    return null
  }

  const groupedSources = groupSourcesByType(image)

  return (
    <picture className="responsive-picture responsive-picture-fill">
      {groupedSources.map(([type, sources]) => (
        <source key={type} type={type} srcSet={resolveAssetSrcSet(sources)} sizes={sizes} />
      ))}
      <img
        {...imgProps}
        src={resolveAssetUrl(image.src)}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
      />
    </picture>
  )
}