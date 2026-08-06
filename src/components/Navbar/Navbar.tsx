import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navLinks, site } from '../../data/site'
import { BrandMark } from '../ui/BrandMark'
import { ThemeToggle } from '../ui/ThemeToggle'
import styles from './Navbar.module.css'

const SECTION_IDS = ['services', 'about', 'testimonials', 'contact'] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight whichever section is currently in view.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // Escape closes the drawer and returns focus to the button that opened it.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  // Stop the page scrolling behind the open drawer.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={`${styles.inner} container`} aria-label="Primary">
        <a href="#home" className={styles.brand} aria-label={`${site.shortName} home`}>
          <BrandMark size={36} />
          <span className={styles.brandName}>
            Krest<strong>kore</strong>
          </span>
        </a>

        <button
          type="button"
          className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ''}`}
          onClick={closeMenu}
          tabIndex={-1}
          aria-hidden="true"
        />

        <ul id="primary-menu" className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={closeMenu}
                aria-current={activeSection === link.href.slice(1) ? 'true' : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" className={styles.cta} onClick={closeMenu}>
              Get Started
            </a>
          </li>
        </ul>

        <div className={styles.actions}>
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className={styles.menuToggle}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="primary-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </header>
  )
}
