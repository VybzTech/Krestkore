import {
  ChartColumn,
  Cloud,
  CodeXml,
  MonitorCog,
  Network,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

export interface Service {
  icon: LucideIcon
  category: string
  title: string
  desc: string
  items: readonly string[]
}

export const services: readonly Service[] = [
  {
    icon: MonitorCog,
    category: 'Infrastructure',
    title: 'Hardware Procurement & Maintenance',
    desc: 'Sourcing and maintaining high-end IT equipment tailored to your operational requirements.',
    items: ['Hardware sourcing & repairs', 'Upgrades & optimization', 'Asset lifecycle management'],
  },
  {
    icon: Network,
    category: 'Infrastructure',
    title: 'Networking & Deployment',
    desc: 'Designing and implementing robust network architectures for high-speed, secure connectivity.',
    items: ['LAN/WAN design', 'Wireless infrastructure', 'VPN & firewall setup'],
  },
  {
    icon: Cloud,
    category: 'Infrastructure',
    title: 'Server Infrastructure',
    desc: 'Deploying scalable server solutions for maximum uptime, on-premises and in the cloud.',
    items: ['On-prem server deployment', 'Cloud migrations', 'Backup & disaster recovery'],
  },
  {
    icon: ShieldCheck,
    category: 'Security',
    title: 'Security Systems',
    desc: 'Procurement, installation, and maintenance of physical and digital security solutions.',
    items: ['CCTV installation', 'Access control systems', 'Biometric solutions'],
  },
  {
    icon: CodeXml,
    category: 'Software',
    title: 'Custom Software Development',
    desc: 'Bespoke, responsive software solutions, web platforms, mobile apps, and internal tools.',
    items: ['Web & mobile apps', 'UI/UX-focused design', 'API integrations'],
  },
  {
    icon: ChartColumn,
    category: 'Intelligence',
    title: 'Data Analysis & IT Consultation',
    desc: 'Transforming raw data into actionable insights and guiding long-term digital strategy.',
    items: ['Business intelligence', 'Digital transformation', 'Technical training'],
  },
]
