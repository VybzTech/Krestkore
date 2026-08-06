import { Check } from 'lucide-react'
import { services } from '../../data/services'
import { useReveal } from '../../hooks/useReveal'
import styles from './Services.module.css'

export function Services() {
  const { ref, revealed } = useReveal<HTMLDivElement>()

  return (
    <section className={styles.section} id="services" aria-labelledby="services-heading">
      <div className="edgeRule" style={{ top: 0 }} aria-hidden="true" />
      <div className="container">
        <header className={styles.header}>
          <span className="sectionLabel">What We Do</span>
          <h2 id="services-heading" className={styles.title}>
            Full-Spectrum
            <br />
            <em>IT Solutions</em>
          </h2>
          <p className={styles.sub}>
            We bridge the gap between complex technical requirements and real business outcomes.
          </p>
        </header>

        <div ref={ref} className={`${styles.grid} ${revealed ? styles.revealed : ''}`}>
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <article
                className={styles.card}
                key={service.title}
                style={{ '--reveal-delay': `${index * 0.08}s` } as React.CSSProperties}
              >
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
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
