import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { parseLegendFile } from './parse-legend.mjs'
import { scanRepositoryContent } from './scan-repo.mjs'

const REPOSITORY_INFO = {
  owner: process.env.BITLORE_GITHUB_OWNER ?? 'nuttyproducer',
  repo: process.env.BITLORE_GITHUB_REPO ?? 'Computing-Legends-on-Earth-Collection',
  branch: process.env.BITLORE_GITHUB_BRANCH ?? 'website',
}

REPOSITORY_INFO.rawContentBase = `https://raw.githubusercontent.com/${REPOSITORY_INFO.owner}/${REPOSITORY_INFO.repo}/${REPOSITORY_INFO.branch}`

function normalizePosixPath(value) {
  return value.split(path.sep).join(path.posix.sep)
}

function stripMarkdownDecoration(value) {
  return value
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/`/g, '')
    .trim()
}

function normalizeLookupKey(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function createWikipediaUrl(name) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(name.trim().replace(/\s+/g, '_'))}`
}

function createLegendCatalog(legendDetails) {
  const byName = new Map()

  const addName = (name, entry) => {
    if (!name) {
      return
    }

    const normalized = normalizeLookupKey(name)
    if (!normalized || byName.has(normalized)) {
      return
    }

    byName.set(normalized, entry)
  }

  for (const detail of legendDetails) {
    const entry = {
      slug: detail.slug,
      name: detail.name,
      fullName: detail.fullName,
      sourceDirectory: normalizePosixPath(path.posix.dirname(detail.sourcePath)),
    }

    addName(detail.name, entry)
    addName(detail.fullName, entry)
    addName(titleFromSlug(detail.slug), entry)
  }

  return { byName }
}

function makeRelativeLegendHref(fromDir, targetDir) {
  const relativePath = path.posix.relative(fromDir, targetDir)
  const normalized = relativePath === '' ? '.' : relativePath
  const withDotPrefix = normalized.startsWith('.') ? normalized : `./${normalized}`
  return withDotPrefix.endsWith('/') ? withDotPrefix : `${withDotPrefix}/`
}

function resolvePersonLink(name, fromDir, catalog) {
  const entry = catalog.byName.get(normalizeLookupKey(name))

  if (entry) {
    return {
      href: makeRelativeLegendHref(fromDir, entry.sourceDirectory),
      kind: 'internal',
    }
  }

  return {
    href: createWikipediaUrl(name),
    kind: 'external',
  }
}

function isExternalHref(href) {
  return /^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('#')
}

function rewriteCatalogLinksInText(markdown, currentDir, catalog, options = {}) {
  const { rewriteExternal = false } = options

  return markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, href) => {
    const cleanLabel = stripMarkdownDecoration(label)
    const entry = catalog.byName.get(normalizeLookupKey(cleanLabel))

    if (!entry) {
      return match
    }

    if (!rewriteExternal && isExternalHref(href)) {
      return match
    }

    return `[${label}](${makeRelativeLegendHref(currentDir, entry.sourceDirectory)})`
  })
}

function rewriteRelatedFiguresSection(sectionMarkdown, currentDir, catalog) {
  const rewrittenLinkedText = rewriteCatalogLinksInText(sectionMarkdown, currentDir, catalog, { rewriteExternal: true })

  return rewrittenLinkedText
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()

      if (/^\|/.test(trimmed) && !/^\|?(?:\s*:?-+:?\s*\|)+\s*$/.test(trimmed)) {
        const cells = trimmed.split('|').slice(1, -1).map((cell) => cell.trim())
        const firstCell = stripMarkdownDecoration(cells[0] ?? '')
        const secondCell = stripMarkdownDecoration(cells[1] ?? '')
        const thirdCell = stripMarkdownDecoration(cells[2] ?? '')
        const isHeaderRow = /^(person|name)$/i.test(firstCell)
          && /^(connection|relationship)$/i.test(secondCell)
          && /^(link|source)$/i.test(thirdCell)

        if (cells.length >= 3 && !isHeaderRow && firstCell) {
          const resolved = resolvePersonLink(firstCell, currentDir, catalog)
          cells[2] = `[${firstCell}](${resolved.href})`
          return `| ${cells.join(' | ')} |`
        }

        return line
      }

      if (trimmed.startsWith('- ') && !trimmed.includes('](')) {
        const bulletMatch = trimmed.match(/^[-*]\s+(?:\*\*|__)?(.+?)(?:\*\*|__)?\s+—\s+(.+)$/)

        if (bulletMatch) {
          const personName = stripMarkdownDecoration(bulletMatch[1])
          const relationship = bulletMatch[2]
          const resolved = resolvePersonLink(personName, currentDir, catalog)
          return `${line.slice(0, line.indexOf('- '))}- [${personName}](${resolved.href}) — ${relationship}`
        }
      }

      return line
    })
    .join('\n')
}

function rewriteMarkdownSections(markdown, currentDir, catalog) {
  const sectionPattern = /^##\s+(.+)$/gm
  const matches = [...markdown.matchAll(sectionPattern)]

  if (matches.length === 0) {
    return rewriteCatalogLinksInText(markdown, currentDir, catalog)
  }

  let output = ''
  let previousEnd = 0

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index]
    const start = match.index ?? 0
    const end = index < matches.length - 1 ? (matches[index + 1].index ?? markdown.length) : markdown.length
    const heading = stripMarkdownDecoration(match[1] ?? '')
    const sectionContent = markdown.slice(start, end)

    output += rewriteCatalogLinksInText(markdown.slice(previousEnd, start), currentDir, catalog)

    if (/^related figures$/i.test(heading)) {
      output += rewriteRelatedFiguresSection(sectionContent, currentDir, catalog)
    } else {
      output += rewriteCatalogLinksInText(sectionContent, currentDir, catalog)
    }

    previousEnd = end
  }

  output += rewriteCatalogLinksInText(markdown.slice(previousEnd), currentDir, catalog)
  return output
}

async function buildCatalog(scanResult) {
  const legends = scanResult.categories.flatMap((category) => category.legends)
  const details = await Promise.all(legends.map((legend) => parseLegendFile(legend, REPOSITORY_INFO)))
  return createLegendCatalog(details)
}

async function fixSourceLinks() {
  const scanResult = await scanRepositoryContent()
  const catalog = await buildCatalog(scanResult)
  const legends = scanResult.categories.flatMap((category) => category.legends)
  const changedFiles = []

  for (const legend of legends) {
    const markdown = await readFile(legend.readmePath, 'utf8')
    const currentDir = normalizePosixPath(legend.relativeDirectoryPath)
    const rewritten = rewriteMarkdownSections(markdown, currentDir, catalog)

    if (rewritten !== markdown) {
      await writeFile(legend.readmePath, rewritten, 'utf8')
      changedFiles.push(legend.relativeReadmePath)
    }
  }

  console.log(`Processed ${legends.length} source markdown files.`)
  console.log(`Updated ${changedFiles.length} files.`)

  if (changedFiles.length > 0) {
    for (const filePath of changedFiles) {
      console.log(`- ${filePath}`)
    }
  }
}

fixSourceLinks().catch((error) => {
  console.error('Failed to rewrite source markdown links.')
  console.error(error)
  process.exitCode = 1
})
