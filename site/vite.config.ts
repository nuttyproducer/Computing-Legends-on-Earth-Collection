import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Computing-Legends-on-Earth-Collection/',
  plugins: [react()],
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
