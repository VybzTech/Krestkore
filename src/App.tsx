import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Aurora } from './components/Aurora/Aurora'
import { ChatAgent } from './components/ChatAgent/ChatAgent'
import { Footer } from './components/Footer/Footer'
import { Navbar } from './components/Navbar/Navbar'
import { HomePage } from './routes/HomePage'
import { PrivacyPage, TermsPage } from './routes/LegalPage'
import { NotFoundPage } from './routes/NotFoundPage'
import { ServicePage } from './routes/ServicePage'

/** New routes start at the top; in-page hashes are left to the page itself. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <a href="#main" className="skipLink">
        Skip to content
      </a>
      <Aurora />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ChatAgent />
    </BrowserRouter>
  )
}
