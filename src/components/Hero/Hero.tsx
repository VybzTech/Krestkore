import { motion } from 'framer-motion'
import { ArrowRight, ChartLine, HardDrive, Lock, Network, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../ui/BrandMark'
import { revealItem, revealScale, revealStagger } from '../../motion/presets'
import styles from './Hero.module.css'

const stats = [
  { value: '1+', label: 'Years Active' },
  { value: '5+', label: 'Clients Served' },
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
        <motion.div
          className={styles.copy}
          variants={revealStagger}
          initial="hidden"
          animate="show"
        >
          <motion.span className="sectionLabel" variants={revealItem}>
            Lagos · Nigeria
          </motion.span>
          <h1 className={styles.title}>
            <motion.span className={styles.line} variants={revealItem}>
              Empowering
            </motion.span>
            <motion.span
              className={`${styles.line} ${styles.accent} gradientText`}
              variants={revealItem}
            >
              Tomorrow
            </motion.span>
            <motion.span className={styles.line} variants={revealItem}>
              Through Innovation
            </motion.span>
          </h1>
          <motion.p className={styles.sub} variants={revealItem}>
            Krestkore Solutions is the digital backbone organisations trust, from hardware
            procurement to custom software, data intelligence, and enterprise networking.
          </motion.p>

          <motion.div className={styles.actions} variants={revealItem}>
            <Link to="/#contact" className={styles.btnPrimary}>
              Start a conversation
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link to="/#services" className={styles.btnGhost}>
              Explore solutions
            </Link>
          </motion.div>

          {/* Term is the label, description is the figure. CSS flips them
              visually so the number still reads first. */}
          <motion.dl className={styles.stats} variants={revealStagger}>
            {stats.map((stat) => (
              <motion.div className={styles.stat} key={stat.label} variants={revealScale}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>{stat.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </motion.div>

        <div className={styles.visual} aria-hidden="true">
          <div className={`${styles.ring} ${styles.ringOuter}`} />
          <div className={`${styles.ring} ${styles.ringMid}`} />
          <div className={`${styles.ring} ${styles.ringInner}`} />
          <div className={styles.core}>
            <BrandMark size={58} className={styles.coreIcon} />
          </div>

          {/*
            Each dot sits at the end of a zero-size arm pinned to the centre.
            Rotating the arm sweeps the dot around its ring, so the orbit
            radius is set by the dot's offset and the direction by the arm.
          */}
          <div className={`${styles.orbit} ${styles.orbitOuter}`}>
            <span className={`${styles.dot} ${styles.dotOne}`} />
          </div>
          <div className={`${styles.orbit} ${styles.orbitMid}`}>
            <span className={`${styles.dot} ${styles.dotTwo}`} />
          </div>
          <div className={`${styles.orbit} ${styles.orbitInner}`}>
            <span className={`${styles.dot} ${styles.dotThree}`} />
          </div>

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
