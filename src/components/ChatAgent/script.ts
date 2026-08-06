import {
  ChartColumn,
  Cloud,
  CodeXml,
  MonitorCog,
  Network,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

/** A service Kris can qualify, mapped to the contact form's service list. */
export interface Topic {
  id: string
  icon: LucideIcon
  label: string
  /** Must match an entry in `serviceOptions` so the form select resolves. */
  service: string
  reply: string
  /** Second-level question narrowing what the visitor actually needs. */
  detailPrompt: string
  details: readonly string[]
}

export const topics: readonly Topic[] = [
  {
    id: 'software',
    icon: CodeXml,
    label: 'Software',
    service: 'Software Development',
    reply: 'Good choice. We build web platforms, mobile apps and internal tools.',
    detailPrompt: 'What are you looking to build?',
    details: ['A new web platform', 'A mobile app', 'An internal tool', 'Not sure yet'],
  },
  {
    id: 'networking',
    icon: Network,
    label: 'Networking',
    service: 'Networking & Infrastructure',
    reply: 'We design and deploy LAN/WAN, wireless and VPN infrastructure.',
    detailPrompt: 'What is the site like?',
    details: ['A single office', 'Multiple branches', 'A new build-out', 'Fixing an existing setup'],
  },
  {
    id: 'hardware',
    icon: MonitorCog,
    label: 'Hardware',
    service: 'Hardware Procurement',
    reply: 'We source and maintain HP, Dell, Lenovo and more.',
    detailPrompt: 'Roughly how many devices?',
    details: ['Under 10', '10 to 50', 'Over 50', 'Servicing what we own'],
  },
  {
    id: 'security',
    icon: ShieldCheck,
    label: 'Security',
    service: 'Security Systems',
    reply: 'We cover CCTV, access control and biometrics.',
    detailPrompt: 'What do you need covered?',
    details: ['CCTV', 'Access control', 'Both', 'Advice first'],
  },
  {
    id: 'cloud',
    icon: Cloud,
    label: 'Servers & cloud',
    service: 'Networking & Infrastructure',
    reply: 'On-prem servers, cloud migration, backup and disaster recovery.',
    detailPrompt: 'Where are you now?',
    details: ['All on-premises', 'Partly in the cloud', 'Planning a migration', 'Need backup/DR'],
  },
  {
    id: 'data',
    icon: ChartColumn,
    label: 'Data & consulting',
    service: 'Data Analysis',
    reply: 'We turn operational data into decisions, and advise on strategy.',
    detailPrompt: 'What would help most?',
    details: ['Reporting & dashboards', 'A data audit', 'IT strategy advice', 'Team training'],
  },
]

export const timelines = ['As soon as possible', 'Within a month', 'This quarter', 'Just exploring'] as const

export type Timeline = (typeof timelines)[number]

/** Builds the message that lands in the contact form and in your inbox. */
export function composeMessage(input: {
  topic: Topic
  detail: string
  timeline: Timeline
}): string {
  return [
    `I'm interested in ${input.topic.label.toLowerCase()} (${input.topic.service}).`,
    `Specifically: ${input.detail}.`,
    `Timeline: ${input.timeline.toLowerCase()}.`,
    '',
    'Sent via Kris on the website.',
  ].join('\n')
}
