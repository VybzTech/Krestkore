import { brands, type Brand } from '../../data/brands'
import { Glyph } from '../ui/Glyph'
import styles from './Marquee.module.css'

function BrandRow({ brand }: { brand: Brand }) {
  return (
    <div
      className={`${styles.logo} ${brand.path ? '' : styles.wordmarkOnly}`}
      style={{ '--brand-color': brand.color } as React.CSSProperties}
    >
      {brand.path ? <Glyph path={brand.path} size={26} /> : null}
      <span className={styles.name}>{brand.name}</span>
    </div>
  )
}

export function Marquee() {
  return (
    <section className={styles.section} aria-labelledby="brands-heading">
      <div className={`container ${styles.label}`}>
        <h2 id="brands-heading" className="sectionLabel">
          Brands We Work With
        </h2>
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
