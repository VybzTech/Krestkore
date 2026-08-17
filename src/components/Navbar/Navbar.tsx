import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { navLinks, site } from '../../data/site'
import { BrandMark } from '../ui/BrandMark'
import { ThemeToggle } from '../ui/ThemeToggle'
import styles from './Navbar.module.css'

const SECTION_IDS = ['services', 'partners', 'about', 'contact'] as const

/** '/#services' -> 'services'; '/privacy' -> null. */
function hashOf(href: string): string | null {
  const index = href.indexOf('#')
  return index === -1 ? null : href.slice(index + 1)
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const openerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

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

  const closeAndRefocus = useCallback(() => {
    setMenuOpen(false)
    openerRef.current?.focus()
  }, [])

  // Escape closes; Tab is trapped inside the drawer while it is open.
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeAndRefocus()
        return
      }
      if (event.key !== 'Tab') return

      const drawer = drawerRef.current
      if (!drawer) return
      const focusable = drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, closeAndRefocus])

  // Stop the page scrolling behind the open drawer.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  // Move focus into the drawer when it opens.
  useEffect(() => {
    if (menuOpen) closeRef.current?.focus()
  }, [menuOpen])

  /*
   * The drawer and its scrim are portalled to <body> rather than rendered
   * inside <header>. When the header is scrolled it carries backdrop-filter,
   * which establishes a containing block for position:fixed descendants, so a
   * scrim with inset:0 would size itself to the ~60px header instead of the
   * viewport. Portalling puts both back on the viewport.
   */
  const drawer = (
    <div className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}>
      <div
        className={styles.scrim}
        onClick={closeAndRefocus}
        role="presentation"
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        id="primary-menu"
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!menuOpen}
      >
        <div className={styles.drawerHead}>
          <span className={styles.drawerTitle}>Menu</span>
          <button
            ref={closeRef}
            type="button"
            className={styles.closeBtn}
            onClick={closeAndRefocus}
            aria-label="Close menu"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <ul className={styles.drawerLinks}>
          {navLinks.map((link, index) => (
            <li key={link.href} style={{ '--i': index } as React.CSSProperties}>
              <Link
                to={link.href}
                onClick={closeMenu}
                aria-current={activeSection === hashOf(link.href) ? 'true' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.drawerFoot}>
          <Link to="/#contact" className={styles.drawerCta} onClick={closeMenu}>
            Get Started
          </Link>
          <div className={styles.drawerTheme}>
            <span>Appearance</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <nav className={`${styles.inner} container`} aria-label="Primary">
          <Link to="/" className={styles.brand} aria-label={`${site.shortName} home`}>
            <BrandMark size={36} />
            <span className={styles.brandName}>
              Krest<strong>kore</strong>
            </span>
          </Link>

          {/* Links and the theme toggle travel together, pinned right. */}
          <div className={styles.cluster}>
            <ul className={styles.links}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    aria-current={activeSection === hashOf(link.href) ? 'true' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/#contact" className={styles.cta}>
                  Get Started
                </Link>
              </li>
            </ul>

            <ThemeToggle className={styles.desktopToggle} />

            <button
              ref={openerRef}
              type="button"
              className={styles.menuToggle}
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="primary-menu"
              aria-label="Open menu"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>
      {createPortal(drawer, document.body)}
    </>
  )
}
