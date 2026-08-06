import { useEffect, useRef, useState } from 'react'

/** True when the browser cannot observe intersections, so nothing can hide. */
function observerUnavailable() {
  return typeof IntersectionObserver === 'undefined'
}

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
  // Start revealed when there is no observer, rather than hiding content.
  const [revealed, setRevealed] = useState(observerUnavailable)

  const threshold = options?.threshold ?? 0.15
  const rootMargin = options?.rootMargin ?? '0px 0px -60px 0px'

  useEffect(() => {
    const element = ref.current
    if (!element || revealed || observerUnavailable()) return

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
