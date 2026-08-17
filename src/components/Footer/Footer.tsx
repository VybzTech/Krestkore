import { Link } from 'react-router-dom'
import { servicePages } from '../../data/servicePages'
import { site } from '../../data/site'
import { socials } from '../../data/socials'
import { BrandMark } from '../ui/BrandMark'
import { Glyph } from '../ui/Glyph'
import styles from './Footer.module.css'

interface FooterLink {
  label: string
  href: string
  /** Internal router links use <Link>; everything else is a plain anchor. */
  internal?: boolean
  external?: boolean
}

const columns: readonly { title: string; items: readonly FooterLink[] }[] = [
  {
    title: 'Services',
    items: servicePages.map((page) => ({
      label: page.title,
      href: `/services/${page.slug}`,
      internal: true,
    })),
  },
  {
    title: 'Company',
    items: [
      { label: 'About Us', href: '/#about', internal: true },
      { label: 'The Tribe', href: '/#about', internal: true },
      { label: 'Our Edge', href: '/#edge', internal: true },
      { label: 'Partners', href: '/#partners', internal: true },
      { label: 'Contact', href: '/#contact', internal: true },
    ],
  },
  {
    title: 'Connect',
    items: [
      { label: 'Email us', href: `mailto:${site.email}` },
      { label: 'Call us', href: `tel:${site.phoneHref}` },
      ...socials.map((social) => ({
        label: social.name,
        href: social.url,
        external: true,
      })),
    ],
  },
]

const legalLinks: readonly FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy', internal: true },
  { label: 'Terms of Service', href: '/terms', internal: true },
]

function FooterAnchor({ link }: { link: FooterLink }) {
  if (link.internal) {
    return <Link to={link.href}>{link.label}</Link>
  }
  return (
    <a
      href={link.href}
      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {link.label}
    </a>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <Link to="/" className={styles.brand} aria-label={`${site.shortName} home`}>
              <BrandMark size={30} />
              <span className={styles.brandName}>
                Krest<strong>kore</strong>
              </span>
            </Link>
            <p className={styles.tagline}>{site.tagline}</p>
            <address className={styles.address}>
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.city}
            </address>
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
            <nav
              className={styles.column}
              key={column.title}
              aria-labelledby={`footer-${column.title}`}
            >
              <h3 id={`footer-${column.title}`}>{column.title}</h3>
              <ul>
                {column.items.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <FooterAnchor link={link} />
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
          <nav className={styles.legal} aria-label="Legal">
            {legalLinks.map((link) => (
              <Link to={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
