import { useEffect, useRef, useState } from 'react'

/**
 * Reveals an element the first time it enters the viewport.
 *
 * The Angular build fired every entrance animation on page load, so anything
 * below the fold had finished animating before it was ever scrolled to. This
 * ties the animation to visibility instead.
 */
export function useReveal<T extends HTMLElement>(options?: {
  threshold?: number
  rootMargin?: string
}) {
  const ref = useRef<T | null>(null)
  const [revealed, setRevealed] = useState(false)

  const threshold = options?.threshold ?? 0.15
  const rootMargin = options?.rootMargin ?? '0px 0px -60px 0px'

  useEffect(() => {
    const element = ref.current
    if (!element || revealed) return

    // Without IntersectionObserver, show the content rather than hide it.
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [revealed, threshold, rootMargin])

  return { ref, revealed }
}
