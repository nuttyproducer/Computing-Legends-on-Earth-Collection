export function extractYears(text?: string) {
  if (!text) {
    return []
  }

  return [...text.matchAll(/\b(1\d{3}|20\d{2})\b/g)].map((match) => Number(match[1]))
}

export function formatCompactLifespan(text?: string) {
  if (!text) {
    return text
  }

  const years = extractYears(text)

  if (years.length >= 2) {
    return `${years[0]}–${years[1]}`
  }

  if (years.length === 1) {
    if (/\b(died|d\.)\b/i.test(text) && !/\b(born|b\.)\b/i.test(text)) {
      return `d. ${years[0]}`
    }

    return `b. ${years[0]}`
  }

  return text
}

export function summarizeMarkdown(markdown?: string, maxLength = 220) {
  if (!markdown) {
    return undefined
  }

  const plainText = toPlainText(markdown)

  if (plainText.length <= maxLength) {
    return plainText
  }

  return `${plainText.slice(0, maxLength).trimEnd()}…`
}

export function toPlainText(markdown?: string) {
  if (!markdown) {
    return ''
  }

  return markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/\*\*|__|`|\*/g, '')
    .replace(/\|/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractParagraphs(markdown?: string, maxParagraphs = 3) {
  if (!markdown) {
    return []
  }

  return markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => !/^(#{1,6}|\||-|>|\*\*)/.test(block))
    .map((block) => toPlainText(block))
    .filter(Boolean)
    .slice(0, maxParagraphs)
}

export function extractBulletItems(markdown?: string, maxItems = 6) {
  if (!markdown) {
    return []
  }

  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => toPlainText(line.replace(/^-\s+/, '')))
    .filter(Boolean)
    .slice(0, maxItems)
}