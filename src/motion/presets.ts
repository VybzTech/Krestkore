import type { Transition, Variants } from 'framer-motion'

/*
 * Shared motion vocabulary.
 *
 * Kept deliberately small: entrances are short (~0.5s), travel a short
 * distance, and use an exponential ease-out. Anything longer or springier
 * starts to feel like the page is fighting the scroll.
 *
 * Every variant animates only `opacity` and `transform`, never layout
 * properties, so nothing triggers reflow mid-animation.
 */

export const easeOutExpo = [0.16, 1, 0.3, 1] as const

export const baseTransition: Transition = {
  duration: 0.55,
  ease: easeOutExpo,
}

/** Fire once, slightly before the element is fully on screen. */
export const viewportOnce = { once: true, amount: 0.2, margin: '0px 0px -80px 0px' } as const

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: baseTransition },
}

export const revealFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: baseTransition },
}

export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 18 },
  show: { opacity: 1, scale: 1, y: 0, transition: baseTransition },
}

/** Parent that walks its children in. Children use `revealItem`. */
export const revealStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

/** Slightly quicker stagger for dense grids. */
export const revealStaggerTight: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045 },
  },
}

/** Standard interactive feedback for buttons and cards. */
export const hoverLift = {
  whileHover: { y: -3, transition: { duration: 0.2, ease: easeOutExpo } },
  whileTap: { y: 0, scale: 0.985, transition: { duration: 0.1 } },
} as const
