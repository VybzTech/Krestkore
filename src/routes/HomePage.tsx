import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { About } from '../components/About/About'
import { Contact } from '../components/Contact/Contact'
import { Hero } from '../components/Hero/Hero'
import { Marquee } from '../components/Marquee/Marquee'
import { Services } from '../components/Services/Services'
// Testimonials are parked until we have client-approved quotes and real
// photography. The component and its data are still in the repo.
// import { Testimonials } from '../components/Testimonials/Testimonials'

export function HomePage() {
  const { hash } = useLocation()

  /*
   * Nav links are `/#services` style, so arriving from another route lands
   * here with a hash the browser has already given up on. Scroll it manually
   * once this page has painted.
   */
  useEffect(() => {
    if (!hash) return
    const target = document.getElementById(hash.slice(1))
    if (!target) return
    const timer = window.setTimeout(
      () => target.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      80,
    )
    return () => window.clearTimeout(timer)
  }, [hash])

  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      {/* <Testimonials /> */}
      <About />
      <Contact />
    </>
  )
}
