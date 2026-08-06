import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  CodeXml,
  Hand,
  MonitorCog,
  Network,
  ShieldCheck,
  X,
  type LucideIcon,
} from 'lucide-react'
import styles from './ChatAgent.module.css'

interface QuickLink {
  icon: LucideIcon
  label: string
  reply: string
}

const quickLinks: readonly QuickLink[] = [
  {
    icon: CodeXml,
    label: 'Software Dev',
    reply:
      'Great choice. Our software team builds custom web and mobile apps. Head to the contact form and we will send a tailored quote.',
  },
  {
    icon: Network,
    label: 'Networking',
    reply:
      'We design and deploy robust LAN/WAN, wireless, and VPN solutions. Get in touch for a site assessment.',
  },
  {
    icon: MonitorCog,
    label: 'Hardware',
    reply:
      'We source and maintain top-brand hardware: HP, Dell, Lenovo, and more. Tell us your requirements and we will spec it out.',
  },
  {
    icon: ShieldCheck,
    label: 'Security',
    reply:
      'From CCTV to biometric access control, we cover physical and digital security. Reach out and we will scope it with you.',
  },
]

export function ChatAgent() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<QuickLink | null>(null)
  const [reply, setReply] = useState<string | null>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const replyTimer = useRef<number | undefined>(undefined)

  // Escape closes the panel and hands focus back to the launcher.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        launcherRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  // The Angular version left this timeout running after teardown.
  useEffect(() => () => window.clearTimeout(replyTimer.current), [])

  const handleQuick = (link: QuickLink) => {
    setSelected(link)
    setReply(null)
    window.clearTimeout(replyTimer.current)
    replyTimer.current = window.setTimeout(() => setReply(link.reply), 400)
  }

  const SelectedIcon = selected?.icon

  return (
    <div className={styles.wrapper}>
      <div
        id="kris-chat-panel"
        className={`${styles.bubble} ${open ? styles.bubbleVisible : ''}`}
        role="dialog"
        aria-label="Chat with Kris, Krestkore support"
        aria-modal="false"
        inert={!open}
      >
        <div className={styles.header}>
          <img
            src="/assets/Animated_Krestkore_Agent.png"
            alt=""
            className={styles.avatar}
            width={40}
            height={40}
          />
          <div className={styles.identity}>
            <strong>
              Kris
              <span className={styles.onlineDot} aria-hidden="true" />
              <span className="srOnly">online</span>
            </strong>
            <small>Krestkore Support</small>
          </div>
          <button
            ref={closeRef}
            type="button"
            className={styles.closeBtn}
            onClick={() => {
              setOpen(false)
              launcherRef.current?.focus()
            }}
            aria-label="Close chat"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.botMsg}>
            <p>
              <Hand size={15} aria-hidden="true" />
              <span>
                Hey there, I&rsquo;m <strong>Kris</strong>, your Krestkore assistant.
              </span>
            </p>
            <p>Need help with IT services, a quote, or just have a question? Pick a topic below.</p>
          </div>

          <div className={styles.quickActions}>
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <button
                  type="button"
                  className={styles.quickBtn}
                  key={link.label}
                  onClick={() => handleQuick(link)}
                >
                  <Icon size={13} aria-hidden="true" />
                  {link.label}
                </button>
              )
            })}
          </div>

          {selected ? (
            <div className={styles.userMsg}>
              <p>
                {SelectedIcon ? <SelectedIcon size={13} aria-hidden="true" /> : null}
                {selected.label}
              </p>
            </div>
          ) : null}

          <div aria-live="polite">
            {reply ? (
              <div className={styles.botMsg}>
                <p>{reply}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.footer}>
          <a href="#contact" className={styles.cta} onClick={() => setOpen(false)}>
            Contact the full team
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      <button
        ref={launcherRef}
        type="button"
        className={styles.agentBtn}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="kris-chat-panel"
        aria-label={open ? 'Close chat with Kris' : 'Chat with Kris'}
      >
        {!open ? (
          <span className={styles.badge} aria-hidden="true">
            Chat with Kris
          </span>
        ) : null}
        <span className={`${styles.imgWrap} ${!open ? styles.bounce : ''}`}>
          <img
            src="/assets/Animated_Krestkore_Agent.png"
            alt=""
            draggable={false}
            width={80}
            height={80}
          />
        </span>
        {!open ? <span className={styles.pingRing} aria-hidden="true" /> : null}
      </button>
    </div>
  )
}
