/** Single source of truth for company details used across the site. */
export const site = {
  name: 'Krestkore Solutions Limited',
  shortName: 'Krestkore',
  tagline: 'Empowering Tomorrow Through Innovation.',
  location: 'Lagos, Nigeria',
  address: {
    line1: '3rd Floor, Update Mall, 1 Ogunnusi Road',
    line2: 'Opposite Excellence Hotel, Aguda, Ogba',
    city: 'Lagos, Nigeria',
  },
  /** Single-line form for the footer and structured data. */
  addressOneLine:
    '3rd Floor, Update Mall, 1 Ogunnusi Road, Opposite Excellence Hotel, Aguda, Ogba, Lagos',
  email: 'info@krestkore.com',
  phone: '0705 045 8935',
  /** E.164 form for tel: links. Nigeria (+234), leading 0 dropped. */
  phoneHref: '+2347050458935',
  handle: '@krestkore',
  formspreeEndpoint: 'https://formspree.io/f/mkjwnyeo',
} as const

export interface NavLink {
  label: string
  href: string
}

/*
 * Root-relative so they work from a service or legal page too, not just the
 * home page. HomePage scrolls to the hash once it has painted.
 */
export const navLinks: readonly NavLink[] = [
  { label: 'Services', href: '/#services' },
  { label: 'Partners', href: '/#partners' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export const serviceOptions = [
  'Hardware Procurement',
  'Networking & Infrastructure',
  'Software Development',
  'Security Systems',
  'Data Analysis',
  'IT Consultation',
] as const

export type ServiceOption = (typeof serviceOptions)[number]
