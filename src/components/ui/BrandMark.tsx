import styles from './BrandMark.module.css'

/**
 * The Krestkore logo mark.
 *
 * Source file: `public/assets/brand/logo-icon.svg`. It is applied as a CSS
 * mask so it can be recoloured per theme (brand teal on dark, deep navy on
 * light) from a single asset. See BrandMark.module.css for why.
 */
export function BrandMark({
  size = 36,
  className,
  /** Paint with the inherited text colour instead of the logo token. */
  inheritColor = false,
}: {
  size?: number
  className?: string | undefined
  inheritColor?: boolean
}) {
  return (
    <span
      className={[styles.mark, inheritColor ? styles.inherit : '', className]
        .filter(Boolean)
        .join(' ')}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}
