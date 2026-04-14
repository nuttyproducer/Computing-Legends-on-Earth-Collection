import { Menu, Search } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { categories } from '../content/generated'
import { ScrollNavLink } from './ScrollLink.tsx'

export function SiteLayout() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <ScrollNavLink className="brand" to="/">
            Computing Legends
          </ScrollNavLink>

          <nav className="nav-links" aria-label="Primary">
            {categories.map((category) => (
              <ScrollNavLink key={category.id} to={`/category/${category.id}`}>
                {category.label}
              </ScrollNavLink>
            ))}
          </nav>

          <div className="topbar-actions" aria-label="Quick actions">
            <ScrollNavLink className="icon-button" to="/search" aria-label="Search archive">
              <Search size={18} />
            </ScrollNavLink>
            <button className="icon-button mobile-only" type="button" aria-label="Open menu">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="site-footer">
        <div className="container footer-layout">
          <div>
            <ScrollNavLink className="brand footer-brand" to="/">
              Computing Legends
            </ScrollNavLink>
            <p>
              The interactive museum and main knowledge base for exploring the people
              who built our digital reality.
            </p>
          </div>

          <div className="footer-links" aria-label="Footer links">
            <ScrollNavLink to="/">Archives</ScrollNavLink>
            <ScrollNavLink to="/category/pioneers">Exhibit Wings</ScrollNavLink>
            <ScrollNavLink to="/category/foundational-cs">Museum Map</ScrollNavLink>
            <ScrollNavLink to="/">Accessibility</ScrollNavLink>
          </div>

          <div className="footer-meta">© 2026 The Living Archive.</div>
        </div>
      </footer>
    </div>
  )
}
