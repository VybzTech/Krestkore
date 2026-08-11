import {
  ChartColumn,
  CodeXml,
  MonitorCog,
  Network,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

/**
 * Content for the standalone service pages.
 *
 * The copy here is a starting point drawn from the home-page summaries. It is
 * meant to be edited by the business: replace the outcomes and the FAQ answers
 * with real project detail as soon as you have it, because that is what makes
 * these pages rank and convert.
 *
 * Unsplash images are placeholders. Swap `image` for your own photography when
 * available; the CSP in netlify.toml already allows images.unsplash.com.
 */
export interface ServicePage {
  slug: string
  icon: LucideIcon
  title: string
  /** Used in <title> and the hero label. */
  shortTitle: string
  summary: string
  /** Matches an entry in `serviceOptions` so the contact form pre-selects it. */
  service: string
  image: string
  imageAlt: string
  outcomes: readonly string[]
  process: readonly { step: string; detail: string }[]
  faqs: readonly { q: string; a: string }[]
}

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`

export const servicePages: readonly ServicePage[] = [
  {
    slug: 'hardware-infrastructure',
    icon: MonitorCog,
    title: 'Hardware & Infrastructure',
    shortTitle: 'Hardware',
    service: 'Hardware Procurement',
    summary:
      'Sourcing, deploying and maintaining the equipment your team depends on, without the markup games or the guesswork.',
    image: UNSPLASH('1591405351990-4726e331f141'),
    imageAlt: 'Rack-mounted server hardware in a data centre',
    outcomes: [
      'Specified to the work, not to a vendor quota',
      'Warranty and lifecycle tracked so nothing expires unnoticed',
      'Repairs and upgrades handled in place where possible',
      'One point of contact for every device you own',
    ],
    process: [
      { step: 'Audit', detail: 'We inventory what you already have and what it is costing you.' },
      { step: 'Specify', detail: 'A build list matched to the actual workload and budget.' },
      { step: 'Procure', detail: 'Sourced through established channels, with warranty intact.' },
      { step: 'Maintain', detail: 'Scheduled servicing, and repairs before failures spread.' },
    ],
    faqs: [
      {
        q: 'Do you only sell new equipment?',
        a: 'No. Where refurbished or certified pre-owned hardware makes sense for the workload, we will say so and price both options.',
      },
      {
        q: 'Can you maintain equipment you did not supply?',
        a: 'Yes. Most of our maintenance work is on estates we inherited from another supplier.',
      },
    ],
  },
  {
    slug: 'networking',
    icon: Network,
    title: 'Networking & Deployment',
    shortTitle: 'Networking',
    service: 'Networking & Infrastructure',
    summary:
      'LAN, WAN, wireless and VPN infrastructure designed to stay up, and documented so the next engineer is not guessing.',
    image: UNSPLASH('1544197150-b99a580bb7a8'),
    imageAlt: 'Network switch with patch cables connected',
    outcomes: [
      'Coverage surveyed before anything is installed',
      'Segmented networks so one compromise is not total',
      'Documented topology handed over at the end',
      'Remote access that does not weaken the perimeter',
    ],
    process: [
      { step: 'Survey', detail: 'Site walk and signal mapping, including the dead spots.' },
      { step: 'Design', detail: 'Topology, addressing and failover, agreed before purchase.' },
      { step: 'Deploy', detail: 'Installed and labelled, usually outside business hours.' },
      { step: 'Verify', detail: 'Throughput and failover tested against the design.' },
    ],
    faqs: [
      {
        q: 'Can you work across multiple branches?',
        a: 'Yes. Multi-site links, site-to-site VPN and central management are routine for us.',
      },
      {
        q: 'What happens when something breaks after handover?',
        a: 'You get documentation and a support arrangement. We do not build estates only we can understand.',
      },
    ],
  },
  {
    slug: 'software-development',
    icon: CodeXml,
    title: 'Software Development',
    shortTitle: 'Software',
    service: 'Software Development',
    summary:
      'Web platforms, mobile apps and internal tools built to fit how your business actually runs.',
    image: UNSPLASH('1461749280684-dccba630e2f6'),
    imageAlt: 'Source code on a monitor',
    outcomes: [
      'Scoped in writing before a line is written',
      'Built to be handed over, not held hostage',
      'Accessible and responsive as standard, not as an extra',
      'Integrated with the systems you already pay for',
    ],
    process: [
      { step: 'Discover', detail: 'We map the process before we propose software for it.' },
      { step: 'Prototype', detail: 'Something clickable early, so scope arguments happen cheaply.' },
      { step: 'Build', detail: 'Shipped in increments you can review, not one big reveal.' },
      { step: 'Hand over', detail: 'Source, documentation and a walkthrough for your team.' },
    ],
    faqs: [
      {
        q: 'Do we own the code?',
        a: 'Yes. Ownership transfers on final payment, including the repository and deployment configuration.',
      },
      {
        q: 'Can you take over a half-finished project?',
        a: 'Often, yes. We start with a short technical review and tell you honestly whether continuing or restarting costs less.',
      },
    ],
  },
  {
    slug: 'security-systems',
    icon: ShieldCheck,
    title: 'Security Systems',
    shortTitle: 'Security',
    service: 'Security Systems',
    summary:
      'CCTV, access control and biometrics, specified for evidence quality rather than camera count.',
    image: UNSPLASH('1557597774-9d273605dfa9'),
    imageAlt: 'Security camera mounted on a building exterior',
    outcomes: [
      'Camera placement driven by sightlines, not symmetry',
      'Footage retained long enough to be useful',
      'Access control that survives staff turnover',
      'Remote review without opening a hole in your network',
    ],
    process: [
      { step: 'Assess', detail: 'Walk the site and identify what actually needs covering.' },
      { step: 'Specify', detail: 'Resolution, lighting and retention sized to the risk.' },
      { step: 'Install', detail: 'Cabled, mounted and commissioned with minimal disruption.' },
      { step: 'Review', detail: 'Footage checked in real conditions, including after dark.' },
    ],
    faqs: [
      {
        q: 'Will the cameras work at night?',
        a: 'That depends on lighting and lens choice, which is why we test after dark before signing off.',
      },
      {
        q: 'Can we view footage remotely?',
        a: 'Yes, through a hardened remote path rather than by exposing the recorder to the internet.',
      },
    ],
  },
  {
    slug: 'data-consulting',
    icon: ChartColumn,
    title: 'Data & IT Consulting',
    shortTitle: 'Data',
    service: 'Data Analysis',
    summary:
      'Turning the data you already collect into decisions, and advising on where the technology budget should go next.',
    image: UNSPLASH('1551288049-bebda4e38f71'),
    imageAlt: 'Analytics dashboard displayed on a laptop screen',
    outcomes: [
      'Reporting that answers a question someone actually asked',
      'A clear view of what your current stack costs you',
      'A prioritised roadmap instead of a wish list',
      'Training so the reports keep working without us',
    ],
    process: [
      { step: 'Collect', detail: 'Find where the data lives and how trustworthy it is.' },
      { step: 'Model', detail: 'Shape it so the questions you care about are answerable.' },
      { step: 'Present', detail: 'Dashboards and reports aimed at decisions, not decoration.' },
      { step: 'Enable', detail: 'Your team learns to maintain and extend it.' },
    ],
    faqs: [
      {
        q: 'Our data is messy. Is that a problem?',
        a: 'It is the normal starting point. Part of the work is telling you which gaps are worth fixing.',
      },
      {
        q: 'Do you need access to production systems?',
        a: 'Usually read-only access or an export is enough. We agree the minimum access needed in writing.',
      },
    ],
  },
]

export function findServicePage(slug: string | undefined): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug)
}
