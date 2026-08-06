import { useId, useRef, useState } from 'react'
import { ArrowRight, Check, LoaderCircle, Mail, MapPin, Phone, TriangleAlert } from 'lucide-react'
import { serviceOptions, site } from '../../data/site'
import {
  emptyForm,
  hasErrors,
  validate,
  type ContactErrors,
  type ContactForm,
} from './validation'
import styles from './Contact.module.css'

type Status = 'idle' | 'sending' | 'success' | 'error'

export function Contact() {
  const [form, setForm] = useState<ContactForm>(emptyForm)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const honeypotRef = useRef<HTMLInputElement>(null)
  const fieldId = useId()

  const id = (field: string) => `${fieldId}-${field}`
  const errorId = (field: string) => `${fieldId}-${field}-error`

  const update =
    (field: keyof ContactForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = event.target
      setForm((current) => ({ ...current, [field]: value }))
      // Clear a field's error as soon as the visitor starts fixing it.
      setErrors((current) => {
        if (!current[field]) return current
        const next = { ...current }
        delete next[field]
        return next
      })
    }

  const reset = () => {
    setForm(emptyForm)
    setErrors({})
    setErrorMessage('')
    setStatus('idle')
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return

    // A filled honeypot means a bot: pretend it worked, send nothing.
    if (honeypotRef.current?.value) {
      setStatus('success')
      return
    }

    const found = validate(form)
    setErrors(found)
    if (hasErrors(found)) {
      const firstField = Object.keys(found)[0]
      if (firstField) document.getElementById(id(firstField))?.focus()
      return
    }

    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch(site.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          service: form.service,
          message: form.message.trim(),
          _subject: `New enquiry from ${form.name.trim()}${form.service ? ` — ${form.service}` : ''}`,
        }),
      })

      if (response.ok) {
        setStatus('success')
        return
      }

      /*
       * Formspree returns 4xx with a JSON body describing the problem. The
       * Angular version treated every non-network outcome as success-or-generic
       * failure and never surfaced the reason.
       */
      const detail = (await response.json().catch(() => null)) as {
        errors?: { message?: string }[]
      } | null
      const first = detail?.errors?.[0]?.message
      setErrorMessage(first ?? 'The form could not be submitted. Please try again.')
      setStatus('error')
    } catch {
      setErrorMessage('We could not reach the server. Check your connection and try again.')
      setStatus('error')
    }
  }

  const infoItems = [
    { icon: MapPin, label: 'Location', value: site.location, href: undefined },
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: Phone, label: 'Phone', value: site.phone, href: `tel:${site.phoneHref}` },
  ] as const

  return (
    <section className={styles.section} id="contact" aria-labelledby="contact-heading">
      <div className="edgeRule" style={{ top: 0 }} aria-hidden="true" />
      <div className="container">
        <div className={styles.inner}>
          <div>
            <span className="sectionLabel">Partner With Us</span>
            <h2 id="contact-heading" className={styles.title}>
              Let&rsquo;s Build Your
              <br />
              <em>Digital Future</em>
            </h2>
            <p className={styles.sub}>
              Whether you&rsquo;re a Lagos-based startup or a multinational requiring a
              comprehensive digital overhaul, Krestkore Solutions is ready to lead the way.
            </p>

            <div className={styles.infoItems}>
              {infoItems.map((item) => {
                const Icon = item.icon
                const content = (
                  <>
                    <span className={styles.infoIcon}>
                      <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span>
                      <span className={styles.infoLabel}>{item.label}</span>
                      <span className={styles.infoValue}>{item.value}</span>
                    </span>
                  </>
                )

                return item.href ? (
                  <a className={styles.infoItem} href={item.href} key={item.label}>
                    {content}
                  </a>
                ) : (
                  <div className={styles.infoItem} key={item.label}>
                    {content}
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            {status === 'success' ? (
              <div className={styles.successCard} role="status">
                <div className={styles.successIcon}>
                  <Check size={30} strokeWidth={3} aria-hidden="true" />
                </div>
                <h3>Message sent</h3>
                <p>
                  Thanks for reaching out. The Krestkore team will get back to you shortly, usually
                  within one business day.
                </p>
                <button type="button" className={styles.btnReset} onClick={reset}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={onSubmit} noValidate>
                {status === 'error' ? (
                  <div className={styles.errorBanner} role="alert">
                    <TriangleAlert size={16} aria-hidden="true" />
                    <span>
                      {errorMessage} You can also email us directly at{' '}
                      <a href={`mailto:${site.email}`}>{site.email}</a>.
                    </span>
                  </div>
                ) : null}

                <div className={styles.row}>
                  <div className={`${styles.group} ${errors.name ? styles.invalid : ''}`}>
                    <label htmlFor={id('name')}>Full name</label>
                    <input
                      id={id('name')}
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={update('name')}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? errorId('name') : undefined}
                    />
                    {errors.name ? (
                      <span className={styles.fieldError} id={errorId('name')}>
                        <TriangleAlert size={12} aria-hidden="true" />
                        {errors.name}
                      </span>
                    ) : null}
                  </div>

                  <div className={`${styles.group} ${errors.email ? styles.invalid : ''}`}>
                    <label htmlFor={id('email')}>Email address</label>
                    <input
                      id={id('email')}
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@company.com"
                      value={form.email}
                      onChange={update('email')}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? errorId('email') : undefined}
                    />
                    {errors.email ? (
                      <span className={styles.fieldError} id={errorId('email')}>
                        <TriangleAlert size={12} aria-hidden="true" />
                        {errors.email}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className={`${styles.group} ${errors.phone ? styles.invalid : ''}`}>
                  <label htmlFor={id('phone')}>
                    Phone number <span className={styles.optional}>(optional)</span>
                  </label>
                  <input
                    id={id('phone')}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+234 000 000 0000"
                    value={form.phone}
                    onChange={update('phone')}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? errorId('phone') : undefined}
                  />
                  {errors.phone ? (
                    <span className={styles.fieldError} id={errorId('phone')}>
                      <TriangleAlert size={12} aria-hidden="true" />
                      {errors.phone}
                    </span>
                  ) : null}
                </div>

                <div className={styles.group}>
                  <label htmlFor={id('service')}>
                    Service interest <span className={styles.optional}>(optional)</span>
                  </label>
                  <select
                    id={id('service')}
                    name="service"
                    value={form.service}
                    onChange={update('service')}
                  >
                    <option value="">Select a service...</option>
                    {serviceOptions.map((option) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`${styles.group} ${errors.message ? styles.invalid : ''}`}>
                  <label htmlFor={id('message')}>Message</label>
                  <textarea
                    id={id('message')}
                    name="message"
                    rows={5}
                    placeholder="Tell us about your project or requirements..."
                    value={form.message}
                    onChange={update('message')}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? errorId('message') : undefined}
                  />
                  {errors.message ? (
                    <span className={styles.fieldError} id={errorId('message')}>
                      <TriangleAlert size={12} aria-hidden="true" />
                      {errors.message}
                    </span>
                  ) : null}
                </div>

                <div className={styles.honeypot} aria-hidden="true">
                  <label htmlFor={id('company-website')}>Leave this field empty</label>
                  <input
                    id={id('company-website')}
                    ref={honeypotRef}
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <button type="submit" className={styles.submit} disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <>
                      <LoaderCircle className={styles.spinner} size={16} aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowRight size={16} aria-hidden="true" />
                    </>
                  )}
                </button>

                <p className={styles.reassurance}>
                  We reply within one business day. No newsletters, no sharing your details.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
