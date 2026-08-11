import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { brands, type Brand } from '../../data/brands'
import { partners } from '../../data/partners'
import { Glyph } from '../ui/Glyph'
import { revealItem, revealStagger, viewportOnce } from '../../motion/presets'
import styles from './Marquee.module.css'

function BrandRow({ brand }: { brand: Brand }) {
  return (
    <div
      className={`${styles.logo} ${brand.path ? '' : styles.wordmarkOnly}`}
      style={{ '--brand-color': brand.color } as CSSProperties}
    >
      {brand.path ? <Glyph path={brand.path} size={22} /> : null}
      <span className={styles.name}>{brand.name}</span>
    </div>
  )
}

export function Marquee() {
  return (
    <section className={styles.section} id="partners" aria-labelledby="partners-heading">
      <div className="container">
        <motion.div
          variants={revealStagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.h2 id="partners-heading" className="sectionLabel" variants={revealItem}>
            Partners We Work With
          </motion.h2>

          <motion.ul className={styles.partners} variants={revealStagger}>
            {partners.map((partner) => (
              <motion.li className={styles.partner} key={partner.name} variants={revealItem}>
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name} loading="lazy" />
                ) : (
                  <span className={styles.partnerName}>{partner.name}</span>
                )}
                <span className={styles.partnerKind}>{partner.kind}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Vendor hardware we source and deploy. Kept distinct from the partner
          list above so the two claims are not confused with one another. */}
      <div className={`container ${styles.deployLabel}`}>
        <span className={styles.deployTitle}>Brands we deploy</span>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.track}>
          <div className={styles.group}>
            {brands.map((brand) => (
              <BrandRow brand={brand} key={brand.name} />
            ))}
          </div>
          {/* Duplicate keeps the loop seamless; hidden from the a11y tree. */}
          <div className={styles.group} aria-hidden="true">
            {brands.map((brand) => (
              <BrandRow brand={brand} key={`${brand.name}-dup`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
