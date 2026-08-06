import { ArrowRight, Brain, CodeXml, Settings2, TrendingUp, type LucideIcon } from 'lucide-react'
import { useReveal } from '../../hooks/useReveal'
import styles from './About.module.css'

const pillars = [
  {
    num: '01',
    title: 'Innovation',
    desc: "We don't just follow trends, we leverage the latest technology to provide our clients with a distinct competitive advantage in their markets.",
  },
  {
    num: '02',
    title: 'Customer Centricity',
    desc: 'Your specific business goals are the foundational blueprint for every technical design and solution we build. Your success is our success.',
  },
  {
    num: '03',
    title: 'Excellence Driven',
    desc: 'Uncompromisingly high standards across procurement, installation, and ongoing support. We take no shortcuts ever.',
  },
] as const

const roles: readonly { icon: LucideIcon; name: string }[] = [
  { icon: Brain, name: 'Product Managers' },
  { icon: Settings2, name: 'Engineers' },
  { icon: CodeXml, name: 'Developers' },
  { icon: TrendingUp, name: 'Data Analysts' },
]

export function About() {
  const { ref, revealed } = useReveal<HTMLDivElement>()

  return (
    <section className={styles.section} id="about" aria-labelledby="edge-heading">
      <div className="container">
        <div className={styles.edgeBlock} id="edge">
          <span className="sectionLabel">The Krestkore Edge</span>
          <h2 id="edge-heading" className={styles.title}>
            Three Pillars of
            <br />
            <em>Uncompromising Excellence</em>
          </h2>
          <div className={styles.pillars}>
            {pillars.map((pillar) => (
              <article className={styles.pillar} key={pillar.num}>
                <div className={styles.pillarNumber} aria-hidden="true">
                  {pillar.num}
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.tribe}>
          <div>
            <span className="sectionLabel">The Krestkore Tribe</span>
            <h2 className={styles.tribeTitle}>
              Young. Passionate.
              <br />
              <em>Expert.</em>
            </h2>
            <p className={styles.tribeDesc}>
              A dedicated collective of innovative product managers, engineers, developers, and
              analysts united by a shared goal of technical excellence. We operate with the agility
              of a boutique agency and the expertise to manage enterprise-level challenges.
            </p>
            <a href="#contact" className={styles.btnPrimary}>
              Partner with us
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>

          <div ref={ref} className={`${styles.roles} ${revealed ? styles.revealed : ''}`}>
            {roles.map((role, index) => {
              const Icon = role.icon
              return (
                <div
                  className={styles.roleCard}
                  key={role.name}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className={styles.roleIcon} size={26} strokeWidth={1.5} aria-hidden="true" />
                  <span className={styles.roleName}>{role.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
