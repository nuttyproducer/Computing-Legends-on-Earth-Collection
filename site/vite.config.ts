import { copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import react from '@vitejs/plugin-react'

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

      await copyFile(path.join(outDir, 'index.html'), path.join(outDir, '404.html'))
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
