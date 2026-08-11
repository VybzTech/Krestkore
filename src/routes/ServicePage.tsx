import { motion } from 'framer-motion'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { findServicePage } from '../data/servicePages'
import { useSeo } from '../hooks/useSeo'
import { revealItem, revealStagger, viewportOnce } from '../motion/presets'
import styles from './Page.module.css'

export function ServicePage() {
  const { slug } = useParams()
  const page = findServicePage(slug)

  useSeo({
    title: page ? `${page.title} — Krestkore Solutions` : 'Krestkore Solutions',
    description: page?.summary ?? 'IT services in Lagos, Nigeria.',
    path: `/services/${slug ?? ''}`,
  })

  if (!page) return <Navigate to="/404" replace />

  const Icon = page.icon

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <Link to="/#services">Services</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span aria-current="page">{page.shortTitle}</span>
        </nav>

        <motion.div
          className={styles.head}
          variants={revealStagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={revealItem}>
            <span className="sectionLabel">
              <Icon size={13} aria-hidden="true" />
              {page.shortTitle}
            </span>
            <h1 className={styles.title}>{page.title}</h1>
            <p className={styles.summary}>{page.summary}</p>
            <Link to="/#contact" className={styles.cta}>
              Talk to us about this
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.figure className={styles.figure} variants={revealItem}>
            {/* Intrinsic size matches the 4/3 CSS aspect-ratio so the browser
                reserves the box before the image lands: no layout shift. */}
            <img
              src={page.image}
              alt={page.imageAlt}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
            />
          </motion.figure>
        </motion.div>

        <motion.div
          className={styles.blocks}
          variants={revealStagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.section variants={revealItem}>
            <h2 className={styles.blockTitle}>What you get</h2>
            <ul className={styles.outcomes}>
              {page.outcomes.map((outcome) => (
                <li key={outcome}>
                  <Check size={15} strokeWidth={2.5} aria-hidden="true" />
                  {outcome}
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section variants={revealItem}>
            <h2 className={styles.blockTitle}>How we work</h2>
            <ol className={styles.steps}>
              {page.process.map((item) => (
                <li key={item.step}>
                  <div>
                    <strong>{item.step}</strong>
                    <p>{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.section>
        </motion.div>

        <motion.section
          className={styles.faq}
          variants={revealStagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.h2 className={styles.blockTitle} variants={revealItem}>
            Common questions
          </motion.h2>
          <div className={styles.faqList}>
            {page.faqs.map((faq) => (
              <motion.div className={styles.faqItem} key={faq.q} variants={revealItem}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
