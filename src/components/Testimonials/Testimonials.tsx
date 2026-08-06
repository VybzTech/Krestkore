import { useCallback, useEffect, useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { testimonials } from '../../data/testimonials'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import styles from './Testimonials.module.css'

const AUTO_ADVANCE_MS = 6000
const COUNT = testimonials.length

export function Testimonials() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const previous = active === 0 ? COUNT - 1 : active - 1

  const goTo = useCallback((index: number) => setActive(((index % COUNT) + COUNT) % COUNT), [])
  const next = useCallback(() => setActive((i) => (i + 1) % COUNT), [])
  const prev = useCallback(() => setActive((i) => (i === 0 ? COUNT - 1 : i - 1)), [])

  /*
   * Auto-advance. The Angular version started this in the constructor and never
   * cleared it, so the timer outlived the component. It also ran regardless of
   * hover, focus, tab visibility, or the reduced-motion preference.
   */
  useEffect(() => {
    if (paused || prefersReducedMotion) return
    const timer = window.setInterval(next, AUTO_ADVANCE_MS)
    return () => window.clearInterval(timer)
  }, [paused, prefersReducedMotion, next, active])

  // Pause while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      prev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    }
  }

  const current = testimonials[active]

  return (
    <section className={styles.section} id="testimonials" aria-labelledby="testimonials-heading">
      <div className="edgeRule" style={{ top: 0 }} aria-hidden="true" />
      <div className="edgeRule" style={{ bottom: 0 }} aria-hidden="true" />

      <div className="container">
        <header className={styles.header}>
          <span className="sectionLabel">Client Stories</span>
          <h2 id="testimonials-heading" className={styles.title}>
            What Our Clients
            <br />
            <em className="gradientText">Say About Us</em>
          </h2>
        </header>

        <div
          className={styles.carousel}
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className={styles.track}>
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className={[
                  styles.slide,
                  index === active ? styles.slideActive : '',
                  index === previous ? styles.slidePrev : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden={index !== active}
                inert={index !== active}
              >
                <figure className={styles.card}>
                  <Quote
                    className={styles.quoteMark}
                    size={40}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <blockquote className={styles.text}>{testimonial.text}</blockquote>
                  <figcaption className={styles.author}>
                    <span className={styles.avatar}>
                      <img
                        src={testimonial.image}
                        alt=""
                        loading="lazy"
                        width={52}
                        height={52}
                        decoding="async"
                      />
                    </span>
                    <span>
                      <span className={styles.authorName}>{testimonial.name}</span>
                      <span className={styles.stars} aria-label="Rated 5 out of 5">
                        {Array.from({ length: 5 }, (_, starIndex) => (
                          <Star key={starIndex} size={13} fill="currentColor" strokeWidth={0} />
                        ))}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>

          <div className={styles.controls}>
            <button type="button" className={styles.ctrlBtn} onClick={prev} aria-label="Previous testimonial">
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <div className={styles.dots}>
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  type="button"
                  className={`${styles.dot} ${index === active ? styles.dotActive : ''}`}
                  onClick={() => goTo(index)}
                  aria-label={`Show testimonial from ${testimonial.name}`}
                  aria-current={index === active}
                />
              ))}
            </div>
            <button type="button" className={styles.ctrlBtn} onClick={next} aria-label="Next testimonial">
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="srOnly" aria-live="polite">
          {current ? `Testimonial ${active + 1} of ${COUNT}, from ${current.name}` : ''}
        </p>

        <div className={styles.thumbRow}>
          {testimonials.map((testimonial, index) => (
            <button
              type="button"
              key={testimonial.name}
              className={`${styles.thumb} ${index === active ? styles.thumbActive : ''}`}
              onClick={() => goTo(index)}
              aria-label={`Show testimonial from ${testimonial.name}`}
            >
              <img
                src={testimonial.image}
                alt=""
                loading="lazy"
                width={48}
                height={48}
                decoding="async"
              />
              <span>{testimonial.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
