import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import react from '@vitejs/plugin-react'

function createGitHubPagesRedirectScript(pathSegmentsToKeep: number) {
  return `<script>(function redirectToIndex(location){var pathSegmentsToKeep=${pathSegmentsToKeep};var l=location;var normalizedSearch=l.search&&l.search!=='?'?l.search.slice(1).replace(/&/g,'~and~'):'';var redirectTarget=l.protocol+'//'+l.hostname+(l.port?':'+l.port:'')+l.pathname.split('/').slice(0,1+pathSegmentsToKeep).join('/')+'/?/'+l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g,'~and~')+(normalizedSearch?'&'+normalizedSearch:'')+l.hash;l.replace(redirectTarget)}(window.location))</script>`
}

function githubPagesSpaFallback(): Plugin {
  let resolvedConfig: ResolvedConfig

  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    configResolved(config) {
      resolvedConfig = config
    },
    async closeBundle() {
      const configDir = path.dirname(fileURLToPath(import.meta.url))
      const outDir = path.resolve(configDir, resolvedConfig.build.outDir)
      const indexHtmlPath = path.join(outDir, 'index.html')
      const notFoundHtmlPath = path.join(outDir, '404.html')
      const indexHtml = await readFile(indexHtmlPath, 'utf8')
      const pathSegmentsToKeep = resolvedConfig.base.split('/').filter(Boolean).length
      const redirectScript = createGitHubPagesRedirectScript(pathSegmentsToKeep)
      const notFoundHtml = indexHtml.replace('<head>', `<head>\n    ${redirectScript}`)

      await writeFile(notFoundHtmlPath, notFoundHtml, 'utf8')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/Computing-Legends-on-Earth-Collection/',
  plugins: [react(), githubPagesSpaFallback()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion'
          }

          if (id.includes('node_modules/lucide-react')) {
            return 'lucide-icons'
          }

          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'react-vendor'
          }

          if (id.includes('/src/content/generated/legend-index.generated.ts')) {
            return 'legend-index-data'
          }

          return undefined
        },
      },
    },
  },
})
