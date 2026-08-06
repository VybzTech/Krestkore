import { About } from './components/About/About'
import { ChatAgent } from './components/ChatAgent/ChatAgent'
import { Contact } from './components/Contact/Contact'
import { Footer } from './components/Footer/Footer'
import { Hero } from './components/Hero/Hero'
import { Marquee } from './components/Marquee/Marquee'
import { Navbar } from './components/Navbar/Navbar'
import { Services } from './components/Services/Services'
import { Testimonials } from './components/Testimonials/Testimonials'

export function App() {
  return (
    <>
      <a href="#main" className="skipLink">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Marquee />
        <Services />
        <Testimonials />
        <About />
        <Contact />
      </main>
      <Footer />
      <ChatAgent />
    </>
  )
}
