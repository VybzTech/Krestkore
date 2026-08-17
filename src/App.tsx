import { lazy, Suspense, useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Aurora } from './components/Aurora/Aurora'
import { ChatAgent } from './components/ChatAgent/ChatAgent'
import { Footer } from './components/Footer/Footer'
import { Navbar } from './components/Navbar/Navbar'
import { HomePage } from './routes/HomePage'

/*
 * Secondary routes are split out of the main bundle. Nearly every visitor
 * lands on "/", so the legal and service pages should not be part of the
 * first download.
 */
const ServicePage = lazy(() =>
  import('./routes/ServicePage').then((m) => ({ default: m.ServicePage })),
)
const PrivacyPage = lazy(() => import('./routes/LegalPage').then((m) => ({ default: m.PrivacyPage })))
const TermsPage = lazy(() => import('./routes/LegalPage').then((m) => ({ default: m.TermsPage })))
const NotFoundPage = lazy(() =>
  import('./routes/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

/** New routes start at the top; in-page hashes are left to the page itself. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

/** Reserves viewport height so a lazy route swap does not collapse the page. */
function RouteFallback() {
  return <div style={{ minHeight: '70vh' }} aria-busy="true" />
}

export function App() {
  return (
    /*
     * reducedMotion="user" makes framer-motion honour the OS setting. The
     * global CSS rule in global.css only disables CSS animations; JS-driven
     * motion would otherwise keep running for visitors who asked for less.
     */
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollToTop />
        <a href="#main" className="skipLink">
          Skip to content
        </a>
        <Aurora />
        <Navbar />
        <main id="main">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ChatAgent />
      </BrowserRouter>
    </MotionConfig>
  )
}
