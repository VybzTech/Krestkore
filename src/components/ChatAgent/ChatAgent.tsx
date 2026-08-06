import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Hand, RotateCcw, Send, X } from 'lucide-react'
import { useEnquiry } from '../../enquiry/useEnquiry'
import { composeMessage, timelines, topics, type Timeline, type Topic } from './script'
import styles from './ChatAgent.module.css'

type Stage = 'topic' | 'detail' | 'timeline' | 'contact' | 'done'

const STAGE_ORDER: Stage[] = ['topic', 'detail', 'timeline', 'contact', 'done']

export function ChatAgent() {
  const { handOff } = useEnquiry()
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState<Stage>('topic')
  const [topic, setTopic] = useState<Topic | null>(null)
  const [detail, setDetail] = useState<string | null>(null)
  const [timeline, setTimeline] = useState<Timeline | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)

  const [contactInView, setContactInView] = useState(false)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const stepIndex = STAGE_ORDER.indexOf(stage)
  const progress = Math.round((stepIndex / (STAGE_ORDER.length - 1)) * 100)

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

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  /*
   * On narrow screens the fixed launcher sits on top of the contact form's
   * fields, stealing taps meant for the inputs. Once the visitor has reached
   * the form they are already converting, so the launcher stands down.
   */
  useEffect(() => {
    const section = document.getElementById('contact')
    if (!section || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) setContactInView(entry.isIntersecting)
      },
      { threshold: 0.12 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Keep the newest turn in view as the conversation grows.
  useEffect(() => {
    const body = bodyRef.current
    if (!body) return
    body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' })
  }, [stage, topic, detail, timeline])

  const restart = () => {
    setStage('topic')
    setTopic(null)
    setDetail(null)
    setTimeline(null)
    setEmailError(null)
  }

  const back = () => {
    if (stage === 'detail') {
      setTopic(null)
      setStage('topic')
    } else if (stage === 'timeline') {
      setDetail(null)
      setStage('detail')
    } else if (stage === 'contact') {
      setTimeline(null)
      setStage('timeline')
    }
  }

  const submit = () => {
    if (!topic || !detail || !timeline) return
    const trimmedEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      setEmailError('Enter a valid email so the team can reply.')
      return
    }
    setEmailError(null)
    handOff({
      name: name.trim(),
      email: trimmedEmail,
      service: topic.service,
      message: composeMessage({ topic, detail, timeline }),
    })
    setStage('done')
    setOpen(false)
  }

  const summary = useMemo(() => {
    if (!topic || !detail || !timeline) return null
    return `${topic.label} · ${detail} · ${timeline.toLowerCase()}`
  }, [topic, detail, timeline])

  return (
    <div
      className={`${styles.wrapper} ${contactInView && !open ? styles.standDown : ''}`}
    >
      <div
        id="kris-chat-panel"
        className={`${styles.bubble} ${open ? styles.bubbleVisible : ''}`}
        role="dialog"
        aria-label="Chat with Kris, Krestkore support"
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
          {stage !== 'topic' ? (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={restart}
              aria-label="Start over"
              title="Start over"
            >
              <RotateCcw size={15} aria-hidden="true" />
            </button>
          ) : null}
          <button
            ref={closeRef}
            type="button"
            className={styles.iconBtn}
            onClick={() => {
              setOpen(false)
              launcherRef.current?.focus()
            }}
            aria-label="Close chat"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div
          className={styles.progress}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Enquiry progress"
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.body} ref={bodyRef}>
          <div className={styles.botMsg}>
            <p>
              <Hand size={15} aria-hidden="true" />
              <span>
                Hey, I&rsquo;m <strong>Kris</strong>. Two quick questions and I&rsquo;ll put the
                right person on it.
              </span>
            </p>
          </div>

          {/* Step 1 — what they need */}
          {stage === 'topic' ? (
            <>
              <div className={styles.botMsg}>
                <p>What can we help with?</p>
              </div>
              <div className={styles.options}>
                {topics.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      type="button"
                      className={styles.optionBtn}
                      key={option.id}
                      onClick={() => {
                        setTopic(option)
                        setStage('detail')
                      }}
                    >
                      <Icon size={13} aria-hidden="true" />
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </>
          ) : null}

          {topic ? (
            <div className={styles.userMsg}>
              <p>{topic.label}</p>
            </div>
          ) : null}

          {/* Step 2 — narrow it down */}
          {stage === 'detail' && topic ? (
            <>
              <div className={styles.botMsg}>
                <p>{topic.reply}</p>
                <p>{topic.detailPrompt}</p>
              </div>
              <div className={styles.options}>
                {topic.details.map((option) => (
                  <button
                    type="button"
                    className={styles.optionBtn}
                    key={option}
                    onClick={() => {
                      setDetail(option)
                      setStage('timeline')
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {detail ? (
            <div className={styles.userMsg}>
              <p>{detail}</p>
            </div>
          ) : null}

          {/* Step 3 — urgency */}
          {stage === 'timeline' ? (
            <>
              <div className={styles.botMsg}>
                <p>Noted. How soon do you need this?</p>
              </div>
              <div className={styles.options}>
                {timelines.map((option) => (
                  <button
                    type="button"
                    className={styles.optionBtn}
                    key={option}
                    onClick={() => {
                      setTimeline(option)
                      setStage('contact')
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {timeline ? (
            <div className={styles.userMsg}>
              <p>{timeline}</p>
            </div>
          ) : null}

          {/* Step 4 — capture the lead */}
          {stage === 'contact' ? (
            <>
              <div className={styles.botMsg}>
                <p>Perfect. Who should we get back to?</p>
              </div>
              <div className={styles.miniForm}>
                <label htmlFor="kris-name">Your name</label>
                <input
                  id="kris-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <label htmlFor="kris-email">Email</label>
                <input
                  id="kris-email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@company.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (emailError) setEmailError(null)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') submit()
                  }}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? 'kris-email-error' : undefined}
                />
                {emailError ? (
                  <span className={styles.miniError} id="kris-email-error" role="alert">
                    {emailError}
                  </span>
                ) : null}
                {summary ? <p className={styles.summary}>{summary}</p> : null}
                <button type="button" className={styles.sendBtn} onClick={submit}>
                  <Send size={14} aria-hidden="true" />
                  Send to the team
                </button>
                <p className={styles.miniNote}>
                  This fills in the contact form for you, so you can add detail before sending.
                </p>
              </div>
            </>
          ) : null}
        </div>

        <div className={styles.footer}>
          {stage !== 'topic' && stage !== 'done' ? (
            <button type="button" className={styles.backBtn} onClick={back}>
              <ArrowLeft size={14} aria-hidden="true" />
              Back
            </button>
          ) : (
            <span />
          )}
          <a href="#contact" className={styles.cta} onClick={() => setOpen(false)}>
            Skip to the form
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
