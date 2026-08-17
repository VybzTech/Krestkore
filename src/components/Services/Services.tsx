import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { services } from '../../data/services'
import { revealItem, revealStaggerTight, viewportOnce } from '../../motion/presets'
import styles from './Services.module.css'

export function Services() {
  return (
    <section className={styles.section} id="services" aria-labelledby="services-heading">
      <div className="edgeRule" style={{ top: 0 }} aria-hidden="true" />
      <div className="container">
        <motion.header
          className={styles.header}
          variants={revealItem}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <span className="sectionLabel">What We Do</span>
          <h2 id="services-heading" className={styles.title}>
            Full-Spectrum
            <br />
            <em className="gradientText">IT Solutions</em>
          </h2>
          <p className={styles.sub}>
            We bridge the gap between complex technical requirements and real business outcomes.
          </p>
        </motion.header>

        <motion.div
          className={styles.grid}
          variants={revealStaggerTight}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.article className={styles.card} key={service.title} variants={revealItem}>
                <div className={styles.accentBar} aria-hidden="true" />
                <div className={styles.cardHeader}>
                  <span className={styles.icon}>
                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className={styles.category}>{service.category}</span>
                </div>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.desc}>{service.desc}</p>
                <ul className={styles.items}>
                  {service.items.map((item) => (
                    <li key={item}>
                      <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                {service.slug ? (
                  /* Covers the whole card so the entire tile is the hit target,
                     while the visible affordance stays a normal link. */
                  <Link to={`/services/${service.slug}`} className={styles.cardLink}>
                    <span className={styles.cardLinkLabel}>
                      Learn more
                      <ArrowRight size={14} aria-hidden="true" />
                    </span>
                    <span className="srOnly">about {service.title}</span>
                  </Link>
                ) : null}
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
