import { access, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const CONTENT_CATEGORIES = [
  { id: 'pioneers', label: 'Pioneers' },
  { id: 'foundational-cs', label: 'Foundational Computer Science' },
  { id: 'systems-languages', label: 'Systems & Languages' },
  { id: 'ai-pioneers', label: 'AI Pioneers' },
  { id: 'modern-ai-ml', label: 'Modern AI & ML' },
  { id: 'web-internet', label: 'Web & Internet' },
]

function resolveRepoRoot() {
  if (process.env.BITLORE_REPO_ROOT) {
    return path.resolve(process.env.BITLORE_REPO_ROOT)
  }

  return fileURLToPath(new URL('../../../', import.meta.url))
}

async function pathExists(targetPath) {
  try {
    await access(targetPath)
    return true
  } catch {
    return false
  }
}

async function scanCategory(repoRoot, category) {
  const categoryPath = path.join(repoRoot, category.id)
  const entries = await readdir(categoryPath, { withFileTypes: true })
  const legends = []

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }

    const slug = entry.name
    const directoryPath = path.join(categoryPath, slug)
    const readmePath = path.join(directoryPath, 'README.md')

    if (!(await pathExists(readmePath))) {
      continue
    }

    legends.push({
      id: `${category.id}/${slug}`,
      category: category.id,
      categoryLabel: category.label,
      slug,
      directoryPath,
      readmePath,
      relativeDirectoryPath: path.relative(repoRoot, directoryPath),
      relativeReadmePath: path.relative(repoRoot, readmePath),
    })
  }

  legends.sort((left, right) => left.slug.localeCompare(right.slug))

  return {
    id: category.id,
    label: category.label,
    count: legends.length,
    legends,
  }
}

export async function scanRepositoryContent() {
  const repoRoot = resolveRepoRoot()
  const categories = []

  for (const category of CONTENT_CATEGORIES) {
    categories.push(await scanCategory(repoRoot, category))
  }

  const totalLegends = categories.reduce((sum, category) => sum + category.count, 0)

  return {
    repoRoot,
    categories,
    totalLegends,
  }
}

function printHumanSummary(scanResult) {
  console.log(`Repo root: ${scanResult.repoRoot}`)
  console.log('')

  for (const category of scanResult.categories) {
    console.log(`${category.id}: ${category.count}`)
  }

  console.log('')
  console.log(`Total legends: ${scanResult.totalLegends}`)
}

async function main() {
  const scanResult = await scanRepositoryContent()
  const wantsJson = process.argv.includes('--json')

  if (wantsJson) {
    console.log(JSON.stringify(scanResult, null, 2))
    return
  }

  printHumanSummary(scanResult)
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  main().catch((error) => {
    console.error('Failed to scan repository content.')
    console.error(error)
    process.exitCode = 1
  })
}