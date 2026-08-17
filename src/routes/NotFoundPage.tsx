import { Link } from 'react-router-dom'
import { servicePages } from '../data/servicePages'
import { useSeo } from '../hooks/useSeo'
import styles from './Page.module.css'

export function NotFoundPage() {
  useSeo({
    title: 'Page not found — Krestkore Solutions',
    description: 'That page does not exist. Find services, partners and contact details here.',
    path: '/404',
  })

  return (
    <div className={styles.page}>
      <div className={`container ${styles.notFound}`}>
        <div className={styles.notFoundCode} aria-hidden="true">
          404
        </div>
        <h1 className={styles.title}>
          That page has <span className="gradientText">moved on</span>
        </h1>
        <p className={styles.summary} style={{ marginInline: 'auto' }}>
          The link is broken or the page no longer exists. Here is where most people were heading.
        </p>
        <div className={styles.links}>
          <Link to="/">Home</Link>
          {servicePages.map((page) => (
            <Link to={`/services/${page.slug}`} key={page.slug}>
              {page.shortTitle}
            </Link>
          ))}
          <Link to="/#contact">Contact</Link>
        </div>
      </div>
    </div>
  )
}
