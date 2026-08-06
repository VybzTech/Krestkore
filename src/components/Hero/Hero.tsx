import { ArrowRight, ChartLine, HardDrive, Lock, Network, type LucideIcon } from 'lucide-react'
import styles from './Hero.module.css'

const stats = [
  { value: '1+', label: 'Years Active' },
  { value: '10+', label: 'Clients Served' },
  { value: '100%', label: 'Commitment' },
] as const

const floatingCards: readonly { icon: LucideIcon; text: string }[] = [
  { icon: HardDrive, text: 'Hardware Procurement' },
  { icon: Network, text: 'Network Architecture' },
  { icon: ChartLine, text: 'Data Intelligence' },
  { icon: Lock, text: 'Cybersecurity' },
]

export function Hero() {
  return (
    <section className={styles.hero} id="home">
      {/* The old blurred orbs are gone; <Aurora /> now provides that bloom
          across the whole page instead of duplicating it here. */}
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.scanLine} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="sectionLabel">Lagos · Nigeria</span>
          <h1 className={styles.title}>
            <span className={styles.line}>Empowering</span>
            <span className={`${styles.line} ${styles.accent} gradientText`}>Tomorrow</span>
            <span className={styles.line}>Through Innovation</span>
          </h1>
          <p className={styles.sub}>
            Krestkore Solutions is the digital backbone organisations trust, from hardware
            procurement to custom software, data intelligence, and enterprise networking.
          </p>

          <div className={styles.actions}>
            <a href="#contact" className={styles.btnPrimary}>
              Start a conversation
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
            <a href="#services" className={styles.btnGhost}>
              Explore solutions
            </a>
          </div>

          {/* Term is the label, description is the figure. CSS flips them
              visually so the number still reads first. */}
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div className={styles.stat} key={stat.label}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={`${styles.ring} ${styles.ringOuter}`} />
          <div className={`${styles.ring} ${styles.ringMid}`} />
          <div className={`${styles.ring} ${styles.ringInner}`} />
          <div className={styles.core}>
            <svg viewBox="0 0 80 80" fill="none" className={styles.coreIcon} focusable="false">
              <path
                d="M16 16L40 40L16 64"
                stroke="var(--accent)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32 16L56 40L32 64"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
              />
            </svg>
          </div>
          <div className={`${styles.dot} ${styles.dotOne}`} />
          <div className={`${styles.dot} ${styles.dotTwo}`} />
          <div className={`${styles.dot} ${styles.dotThree}`} />

          <div className={styles.floatingCards}>
            {floatingCards.map((card, index) => {
              const Icon = card.icon
              return (
                <div
                  className={styles.fcard}
                  key={card.text}
                  style={{ animationDelay: `${index * 0.15}s, 0s` }}
                >
                  <Icon size={16} strokeWidth={2} />
                  <span>{card.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
