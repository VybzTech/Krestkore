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
  /** Must match an entry in `serviceOptions` so the enquiry is routable. */
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

export const timelines = [
  'As soon as possible',
  'Within a month',
  'This quarter',
  'Just exploring',
] as const

export type Timeline = (typeof timelines)[number]

/** An extra qualifying question Kris may or may not ask. */
export interface FollowUp {
  id: string
  prompt: string
  options: readonly string[]
}

/*
 * Questions Kris can draw from. A couple are picked at random per conversation,
 * so two visitors rarely get the same script and returning visitors do not see
 * an identical flow. Topic-specific questions are preferred; the shared pool
 * fills the rest.
 */
const topicFollowUps: Record<string, readonly FollowUp[]> = {
  software: [
    {
      id: 'sw-stage',
      prompt: 'How far along is it?',
      options: ['Just an idea', 'We have designs', 'Replacing something', 'Half-built already'],
    },
    {
      id: 'sw-users',
      prompt: 'Who will use it?',
      options: ['Our staff', 'Our customers', 'Both', 'Not decided'],
    },
  ],
  networking: [
    {
      id: 'net-users',
      prompt: 'Roughly how many people on the network?',
      options: ['Under 20', '20 to 100', 'Over 100', 'Varies a lot'],
    },
    {
      id: 'net-pain',
      prompt: 'What is the main frustration today?',
      options: ['Slow connection', 'Keeps dropping', 'Poor coverage', 'Security worries'],
    },
  ],
  hardware: [
    {
      id: 'hw-type',
      prompt: 'Mostly what kind of kit?',
      options: ['Laptops & desktops', 'Servers', 'Printers & peripherals', 'A mix'],
    },
  ],
  security: [
    {
      id: 'sec-site',
      prompt: 'How many locations?',
      options: ['One', 'Two or three', 'More than three', 'Still deciding'],
    },
  ],
  cloud: [
    {
      id: 'cloud-driver',
      prompt: 'What is driving this?',
      options: ['Cost', 'Reliability', 'Growth', 'A recent incident'],
    },
  ],
  data: [
    {
      id: 'data-source',
      prompt: 'Where does the data live now?',
      options: ['Spreadsheets', 'A database', 'Several systems', 'Honestly, not sure'],
    },
  ],
}

const sharedFollowUps: readonly FollowUp[] = [
  {
    id: 'budget',
    prompt: 'Is there a budget range in mind?',
    options: ['Yes, roughly', 'Need a ballpark first', 'Depends on scope', 'Rather not say'],
  },
  {
    id: 'decision',
    prompt: 'Who else is involved in deciding?',
    options: ['Just me', 'Me and a colleague', 'A committee', 'Not sure yet'],
  },
  {
    id: 'size',
    prompt: 'How big is the team overall?',
    options: ['Under 10', '10 to 50', '50 to 200', 'Over 200'],
  },
]

/** Openers Kris rotates through so the greeting is not identical every visit. */
const openers = [
  'Two quick questions and I will put the right person on it.',
  'Tell me what you need and I will route it to the right engineer.',
  'A few quick answers and the team can come back with something useful.',
  'Give me the shape of it and I will make sure the right person replies.',
] as const

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = copy[i]
    const b = copy[j]
    if (a !== undefined && b !== undefined) {
      copy[i] = b
      copy[j] = a
    }
  }
  return copy
}

export function pickOpener(): string {
  return openers[Math.floor(Math.random() * openers.length)] ?? openers[0]
}

/**
 * Chooses the extra questions for one conversation: topic-specific first, then
 * shared ones, shuffled and capped so the chat never drags on.
 */
export function pickFollowUps(topicId: string, count = 2): FollowUp[] {
  const specific = shuffle(topicFollowUps[topicId] ?? [])
  const shared = shuffle(sharedFollowUps)
  return [...specific, ...shared].slice(0, count)
}

export interface ComposeInput {
  topic: Topic
  detail: string
  timeline: Timeline
  answers: readonly { prompt: string; answer: string }[]
}

/** Builds the message body that lands in the Krestkore inbox. */
export function composeMessage(input: ComposeInput): string {
  const lines = [
    `Interested in: ${input.topic.label} (${input.topic.service})`,
    `Specifically: ${input.detail}`,
    `Timeline: ${input.timeline}`,
  ]
  for (const item of input.answers) {
    lines.push(`${item.prompt} ${item.answer}`)
  }
  lines.push('', 'Captured by Kris on the website.')
  return lines.join('\n')
}
