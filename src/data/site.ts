/** Single source of truth for company details used across the site. */
export const site = {
  name: 'Krestkore Solutions Limited',
  shortName: 'Krestkore',
  tagline: 'Empowering Tomorrow Through Innovation.',
  location: 'Lagos, Nigeria',
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

export const navLinks: readonly NavLink[] = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Clients', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
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
