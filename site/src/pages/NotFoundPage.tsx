import { Seo } from '../components/Seo.tsx'
import { ScrollLink } from '../components/ScrollLink.tsx'

interface NotFoundPageProps {
  title?: string
  description?: string
}

export function NotFoundPage({
  title = 'Page Not Found',
  description = 'This route is not part of the museum map yet.',
}: NotFoundPageProps) {
  return (
    <>
      <Seo title={title} description={description} noIndex />
      <main className="route-main route-main-centered">
      <section className="route-section">
        <div className="container">
          <div className="not-found-panel">
            <p className="eyebrow">Lost in the Archive</p>
            <h1 className="route-title">{title}</h1>
            <p className="route-summary">{description}</p>
            <div className="hero-actions">
              <ScrollLink className="button-primary" to="/">
                Return Home
              </ScrollLink>
              <ScrollLink className="button-secondary" to="/category/pioneers">
                Open First Wing
              </ScrollLink>
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  )
}
