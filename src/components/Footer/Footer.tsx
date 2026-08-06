import { site } from '../../data/site'
import { socials } from '../../data/socials'
import { BrandMark } from '../ui/BrandMark'
import { Glyph } from '../ui/Glyph'
import styles from './Footer.module.css'

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

const columns: readonly { title: string; items: readonly FooterLink[] }[] = [
  {
    title: 'Services',
    items: [
      { label: 'Hardware & Infrastructure', href: '#services' },
      { label: 'Networking', href: '#services' },
      { label: 'Software Development', href: '#services' },
      { label: 'Security Systems', href: '#services' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About Us', href: '#about' },
      { label: 'The Tribe', href: '#about' },
      { label: 'Our Edge', href: '#edge' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Connect',
    items: [
      { label: 'Email us', href: `mailto:${site.email}`, external: true },
      { label: 'Call us', href: `tel:${site.phoneHref}`, external: true },
      ...socials.map((social) => ({ label: social.name, href: social.url, external: true })),
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <a href="#home" className={styles.brand} aria-label={`${site.shortName} home`}>
              <BrandMark size={30} />
              <span className={styles.brandName}>
                Krest<strong>kore</strong>
              </span>
            </a>
            <p className={styles.tagline}>{site.tagline}</p>
            <p className={styles.sub}>
              {site.location} · {site.handle}
            </p>
            <div className={styles.socialIcons}>
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  aria-label={`${site.shortName} on ${social.name}`}
                >
                  <Glyph path={social.path} size={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <nav className={styles.column} key={column.title} aria-labelledby={`footer-${column.title}`}>
              <h3 id={`footer-${column.title}`}>{column.title}</h3>
              <ul>
                {column.items.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <a
                      href={link.href}
                      {...(link.external && link.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.bottom}>
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p className={styles.builtWith}>Built with precision. Delivered with purpose.</p>
        </div>
      </div>
    </footer>
  )
}
