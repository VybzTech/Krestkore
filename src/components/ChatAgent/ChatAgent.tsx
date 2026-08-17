import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Hand, LoaderCircle, RotateCcw, Send, X } from 'lucide-react'
import { site } from '../../data/site'
import {
  composeMessage,
  pickFollowUps,
  pickOpener,
  timelines,
  topics,
  type FollowUp,
  type Timeline,
  type Topic,
} from './script'
import styles from './ChatAgent.module.css'

type Stage = 'topic' | 'detail' | 'followUp' | 'timeline' | 'name' | 'email' | 'sending' | 'done'

interface Answer {
  prompt: string
  answer: string
}

const bubble = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ChatAgent() {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState<Stage>('topic')
  const [topic, setTopic] = useState<Topic | null>(null)
  const [detail, setDetail] = useState<string | null>(null)
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [followUpIndex, setFollowUpIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeline, setTimeline] = useState<Timeline | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const [contactInView, setContactInView] = useState(false)

  const launcherRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  // Fixed for the life of the conversation so it does not change mid-chat.
  const opener = useMemo(() => pickOpener(), [])

  const currentFollowUp = followUps[followUpIndex] ?? null

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

  /* The fixed launcher covers the contact form's inputs on narrow screens. */
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
  }, [stage, followUpIndex, answers.length])

  // One field at a time: focus whichever just appeared.
  useEffect(() => {
    if (stage === 'name') nameRef.current?.focus()
    if (stage === 'email') emailRef.current?.focus()
  }, [stage])

  const restart = () => {
    setStage('topic')
    setTopic(null)
    setDetail(null)
    setFollowUps([])
    setFollowUpIndex(0)
    setAnswers([])
    setTimeline(null)
    setError(null)
    setSendError(null)
  }

  const chooseTopic = (option: Topic) => {
    setTopic(option)
    setFollowUps(pickFollowUps(option.id))
    setFollowUpIndex(0)
    setStage('detail')
  }

  const chooseDetail = (option: string) => {
    setDetail(option)
    setStage(followUps.length > 0 ? 'followUp' : 'timeline')
  }

  const answerFollowUp = (option: string) => {
    if (!currentFollowUp) return
    setAnswers((current) => [...current, { prompt: currentFollowUp.prompt, answer: option }])
    const next = followUpIndex + 1
    setFollowUpIndex(next)
    setStage(next < followUps.length ? 'followUp' : 'timeline')
  }

  const submitName = () => {
    if (name.trim().length < 2) {
      setError('A name helps us address the reply.')
      return
    }
    setError(null)
    setStage('email')
  }

  const send = async () => {
    if (!topic || !detail || !timeline) return
    const trimmedEmail = email.trim()
    if (!EMAIL.test(trimmedEmail)) {
      setError('Check the email address, it looks incomplete.')
      return
    }
    setError(null)
    setSendError(null)
    setStage('sending')

    try {
      const response = await fetch(site.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: trimmedEmail,
          service: topic.service,
          message: composeMessage({ topic, detail, timeline, answers }),
          _subject: `Kris enquiry: ${topic.label} — ${name.trim()}`,
          source: 'Kris chat',
        }),
      })

      if (!response.ok) {
        const detailBody = (await response.json().catch(() => null)) as {
          errors?: { message?: string }[]
        } | null
        setSendError(detailBody?.errors?.[0]?.message ?? 'That did not send. Please try again.')
        setStage('email')
        return
      }
      setStage('done')
    } catch {
      setSendError('We could not reach the server. Check your connection and try again.')
      setStage('email')
    }
  }

  const back = () => {
    setError(null)
    if (stage === 'detail') {
      setTopic(null)
      setStage('topic')
    } else if (stage === 'followUp') {
      if (followUpIndex === 0) {
        setDetail(null)
        setStage('detail')
      } else {
        setFollowUpIndex(followUpIndex - 1)
        setAnswers((current) => current.slice(0, -1))
      }
    } else if (stage === 'timeline') {
      if (followUps.length > 0) {
        setFollowUpIndex(followUps.length - 1)
        setAnswers((current) => current.slice(0, -1))
        setStage('followUp')
      } else {
        setDetail(null)
        setStage('detail')
      }
    } else if (stage === 'name') {
      setTimeline(null)
      setStage('timeline')
    } else if (stage === 'email') {
      setStage('name')
    }
  }

  const canGoBack = ['detail', 'followUp', 'timeline', 'name', 'email'].includes(stage)
  const totalSteps = 4 + followUps.length
  const doneSteps =
    (topic ? 1 : 0) + (detail ? 1 : 0) + answers.length + (timeline ? 1 : 0) +
    (stage === 'email' || stage === 'sending' || stage === 'done' ? 1 : 0)
  const progress = Math.min(100, Math.round((doneSteps / (totalSteps + 1)) * 100))

  return (
    <div className={`${styles.wrapper} ${contactInView && !open ? styles.standDown : ''}`}>
      <div
        id="kris-chat-panel"
        className={`${styles.bubble} ${open ? styles.bubbleVisible : ''}`}
        role="dialog"
        aria-label="Work with us — chat with Kris"
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
            <small>Krestkore</small>
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
          <motion.span animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>

        <div className={styles.body} ref={bodyRef}>
          <div className={styles.botMsg}>
            <p>
              <Hand size={15} aria-hidden="true" />
              <span>
                Hey, I&rsquo;m <strong>Kris</strong>. {opener}
              </span>
            </p>
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            {stage === 'topic' ? (
              <motion.div key="q-topic" variants={bubble} initial="hidden" animate="show" exit="exit">
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
                        onClick={() => chooseTopic(option)}
                      >
                        <Icon size={13} aria-hidden="true" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            ) : null}

            {topic ? (
              <motion.div key="a-topic" className={styles.userMsg} variants={bubble} initial="hidden" animate="show">
                <p>{topic.label}</p>
              </motion.div>
            ) : null}

            {stage === 'detail' && topic ? (
              <motion.div key="q-detail" variants={bubble} initial="hidden" animate="show" exit="exit">
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
                      onClick={() => chooseDetail(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {detail ? (
              <motion.div key="a-detail" className={styles.userMsg} variants={bubble} initial="hidden" animate="show">
                <p>{detail}</p>
              </motion.div>
            ) : null}

            {answers.map((item) => (
              <motion.div
                key={`a-${item.prompt}`}
                className={styles.userMsg}
                variants={bubble}
                initial="hidden"
                animate="show"
              >
                <p>{item.answer}</p>
              </motion.div>
            ))}

            {stage === 'followUp' && currentFollowUp ? (
              <motion.div key={`q-${currentFollowUp.id}`} variants={bubble} initial="hidden" animate="show" exit="exit">
                <div className={styles.botMsg}>
                  <p>{currentFollowUp.prompt}</p>
                </div>
                <div className={styles.options}>
                  {currentFollowUp.options.map((option) => (
                    <button
                      type="button"
                      className={styles.optionBtn}
                      key={option}
                      onClick={() => answerFollowUp(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {stage === 'timeline' ? (
              <motion.div key="q-timeline" variants={bubble} initial="hidden" animate="show" exit="exit">
                <div className={styles.botMsg}>
                  <p>How soon do you need this?</p>
                </div>
                <div className={styles.options}>
                  {timelines.map((option) => (
                    <button
                      type="button"
                      className={styles.optionBtn}
                      key={option}
                      onClick={() => {
                        setTimeline(option)
                        setStage('name')
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {timeline ? (
              <motion.div key="a-timeline" className={styles.userMsg} variants={bubble} initial="hidden" animate="show">
                <p>{timeline}</p>
              </motion.div>
            ) : null}

            {/* One field at a time, each in its own turn. */}
            {stage === 'name' ? (
              <motion.div key="q-name" variants={bubble} initial="hidden" animate="show" exit="exit">
                <div className={styles.botMsg}>
                  <p>Last bit. What should we call you?</p>
                </div>
                <div className={styles.miniForm}>
                  <label htmlFor="kris-name" className="srOnly">
                    Your name
                  </label>
                  <input
                    id="kris-name"
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      if (error) setError(null)
                    }}
                    onKeyDown={(event) => event.key === 'Enter' && submitName()}
                    aria-invalid={Boolean(error)}
                  />
                  {error ? (
                    <span className={styles.miniError} role="alert">
                      {error}
                    </span>
                  ) : null}
                  <button type="button" className={styles.sendBtn} onClick={submitName}>
                    Continue
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            ) : null}

            {name && stage !== 'name' && stage !== 'topic' && stage !== 'detail' ? (
              <motion.div key="a-name" className={styles.userMsg} variants={bubble} initial="hidden" animate="show">
                <p>{name}</p>
              </motion.div>
            ) : null}

            {stage === 'email' || stage === 'sending' ? (
              <motion.div key="q-email" variants={bubble} initial="hidden" animate="show" exit="exit">
                <div className={styles.botMsg}>
                  <p>Thanks {name.split(' ')[0]}. Where should the team reply?</p>
                </div>
                <div className={styles.miniForm}>
                  <label htmlFor="kris-email" className="srOnly">
                    Email
                  </label>
                  <input
                    id="kris-email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    disabled={stage === 'sending'}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (error) setError(null)
                      if (sendError) setSendError(null)
                    }}
                    onKeyDown={(event) => event.key === 'Enter' && void send()}
                    aria-invalid={Boolean(error)}
                  />
                  {error ? (
                    <span className={styles.miniError} role="alert">
                      {error}
                    </span>
                  ) : null}
                  {sendError ? (
                    <span className={styles.miniError} role="alert">
                      {sendError}{' '}
                      <a href={`mailto:${site.email}`} className={styles.inlineLink}>
                        Email us instead
                      </a>
                    </span>
                  ) : null}
                  <button
                    type="button"
                    className={styles.sendBtn}
                    onClick={() => void send()}
                    disabled={stage === 'sending'}
                  >
                    {stage === 'sending' ? (
                      <>
                        <LoaderCircle className={styles.spinner} size={14} aria-hidden="true" />
                        Sending
                      </>
                    ) : (
                      <>
                        <Send size={14} aria-hidden="true" />
                        Send to the team
                      </>
                    )}
                  </button>
                  <p className={styles.miniNote}>
                    This goes straight to {site.email}. No newsletter, no sharing.
                  </p>
                </div>
              </motion.div>
            ) : null}

            {stage === 'done' ? (
              <motion.div key="done" variants={bubble} initial="hidden" animate="show">
                <div className={styles.doneCard}>
                  <span className={styles.doneIcon}>
                    <Check size={18} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <div>
                    <strong>Sent.</strong>
                    <p>
                      Thanks {name.split(' ')[0]} — that is with the team now. Expect a reply within
                      one business day.
                    </p>
                  </div>
                </div>
                <div className={styles.options}>
                  <button type="button" className={styles.optionBtn} onClick={restart}>
                    <RotateCcw size={13} aria-hidden="true" />
                    Ask about something else
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className={styles.footer}>
          {canGoBack ? (
            <button type="button" className={styles.backBtn} onClick={back}>
              <ArrowLeft size={14} aria-hidden="true" />
              Back
            </button>
          ) : (
            <span />
          )}
          <a href="#contact" className={styles.cta} onClick={() => setOpen(false)}>
            Use the full form
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
        aria-label={open ? 'Close the enquiry chat' : 'Work with us'}
      >
        {!open ? (
          <span className={styles.badge} aria-hidden="true">
            Work with us
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
