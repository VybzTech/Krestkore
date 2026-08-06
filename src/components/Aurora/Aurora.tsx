import { useEffect, useRef, useState } from 'react'
import styles from './Aurora.module.css'

/**
 * Ambient gradient-mesh backdrop for the whole page, with a bloom that
 * follows the pointer.
 *
 * The pointer position is written straight to CSS custom properties inside a
 * rAF callback. Putting it in React state would re-render the tree on every
 * mousemove (~60/s) for a purely decorative effect.
 */
export function Aurora() {
  const ref = useRef<HTMLDivElement>(null)
  const [spotlightOn, setSpotlightOn] = useState(false)

  useEffect(() => {
    // Skip on touch and for visitors who asked for less motion.
    const fine = window.matchMedia('(pointer: fine)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || calm.matches) return

    const element = ref.current
    if (!element) return

    let frame = 0
    let pendingX = 0
    let pendingY = 0

    const paint = () => {
      frame = 0
      element.style.setProperty('--mx', `${pendingX}px`)
      element.style.setProperty('--my', `${pendingY}px`)
    }

    const onMove = (event: PointerEvent) => {
      pendingX = event.clientX
      pendingY = event.clientY
      if (!frame) frame = requestAnimationFrame(paint)
      // Deferred so the bloom fades in at the pointer, not from the corner.
      setSpotlightOn(true)
    }

    const onLeave = () => setSpotlightOn(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className={styles.aurora} aria-hidden="true">
      <div className={`${styles.blob} ${styles.blobOne}`} />
      <div className={`${styles.blob} ${styles.blobTwo}`} />
      <div className={`${styles.blob} ${styles.blobThree}`} />
      <div className={`${styles.spotlight} ${spotlightOn ? styles.spotlightOn : ''}`} />
      <div className={styles.vignette} />
    </div>
  )
}
