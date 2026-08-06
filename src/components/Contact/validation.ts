export interface ContactForm {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

export type ContactErrors = Partial<Record<keyof ContactForm, string>>

export const emptyForm: ContactForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
}

/* Deliberately permissive: one @, a dot in the domain, no spaces. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Digits, spaces and the usual punctuation; 7 to 15 digits once stripped. */
const PHONE_ALLOWED = /^[\d\s+().-]+$/

export function validate(form: ContactForm): ContactErrors {
  const errors: ContactErrors = {}

  const name = form.name.trim()
  if (!name) errors.name = 'Please tell us your name.'
  else if (name.length < 2) errors.name = 'That name looks too short.'

  const email = form.email.trim()
  if (!email) errors.email = 'We need an email address to reply to.'
  else if (!EMAIL.test(email)) errors.email = 'Check the email address, it looks incomplete.'

  const phone = form.phone.trim()
  if (phone) {
    const digits = phone.replace(/\D/g, '')
    if (!PHONE_ALLOWED.test(phone) || digits.length < 7 || digits.length > 15) {
      errors.phone = 'Enter a valid phone number, or leave it blank.'
    }
  }

  const message = form.message.trim()
  if (!message) errors.message = 'Let us know what you need help with.'
  else if (message.length < 10) errors.message = 'A little more detail helps us respond usefully.'

  return errors
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0
}
