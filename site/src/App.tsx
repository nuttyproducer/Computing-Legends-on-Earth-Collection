import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'
import './App.css'

const HomePage = lazy(async () => ({ default: (await import('./pages/HomePage')).HomePage }))
const CategoryPage = lazy(async () => ({ default: (await import('./pages/CategoryPage')).CategoryPage }))
const LegendPage = lazy(async () => ({ default: (await import('./pages/LegendPage')).LegendPage }))
const SearchPage = lazy(async () => ({ default: (await import('./pages/SearchPage')).SearchPage }))
const NotFoundPage = lazy(async () => ({ default: (await import('./pages/NotFoundPage')).NotFoundPage }))

function RouteFallback() {
  return (
    <main className="route-main route-main-centered">
      <div className="container">
        <div className="not-found-panel">
          <p className="eyebrow">Loading Exhibit</p>
          <h1 className="route-title">Preparing the gallery…</h1>
          <p className="route-summary">The archive is opening the next room.</p>
        </div>
      </div>
    </main>
  )
}

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="legend/:slug" element={<LegendPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
