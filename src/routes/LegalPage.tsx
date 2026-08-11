import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import styles from './Page.module.css'

/*
 * Starter legal copy. It covers what a brochure site that collects contact-form
 * submissions actually does, and nothing it does not. Have a lawyer review it
 * before you rely on it, and revise it the moment you add analytics, tracking
 * or accounts.
 */
const LAST_UPDATED = 'August 2026'

export function PrivacyPage() {
  useDocumentTitle('Privacy Policy — Krestkore Solutions')

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span aria-current="page">Privacy Policy</span>
        </nav>

        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>

        <div className={styles.prose}>
          <p>
            This policy explains what {site.name} does with the information you give us through
            this website. It applies to this site only.
          </p>

          <h2>What we collect</h2>
          <p>
            Only what you type into the contact form or the chat assistant: your name, email
            address, optional phone number, the service you are interested in, and your message. We
            do not use advertising trackers, and we do not build profiles of visitors.
          </p>

          <h2>How it reaches us</h2>
          <p>
            Form submissions are delivered to our inbox by Formspree, a third-party form service.
            Your submission passes through their systems in order to reach us, and is subject to
            their privacy practices as well as ours.
          </p>

          <h2>What we use it for</h2>
          <ul>
            <li>Replying to your enquiry</li>
            <li>Preparing a quote or proposal you asked for</li>
            <li>Keeping a record of the work we discussed</li>
          </ul>
          <p>
            We do not sell your information, and we do not add you to a marketing list without
            asking.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiries that do not become projects are deleted once they are clearly no longer
            relevant. Records relating to actual engagements are kept as long as we need them for
            the work and for our accounting obligations.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us what we hold about you, ask for it to be corrected, or ask us to delete
            it. Email <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond.
          </p>

          <h2>Cookies</h2>
          <p>
            This site sets no cookies. It stores one item in your browser locally, your light or
            dark theme preference, which never leaves your device and is not readable by us.
          </p>

          <h2>Contact</h2>
          <p>
            {site.name}
            <br />
            {site.addressOneLine}
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export function TermsPage() {
  useDocumentTitle('Terms of Service — Krestkore Solutions')

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span aria-current="page">Terms of Service</span>
        </nav>

        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>

        <div className={styles.prose}>
          <h2>About these terms</h2>
          <p>
            These terms cover your use of this website. They do not govern any project we carry out
            for you. Paid work is governed by the separate proposal and agreement we sign with you,
            and where the two differ, that agreement wins.
          </p>

          <h2>Using this site</h2>
          <p>
            You may read, share and link to this site freely. Please do not attempt to disrupt it,
            scrape it at a volume that degrades it for others, or misrepresent your identity when
            contacting us through it.
          </p>

          <h2>What is on the site</h2>
          <p>
            Service descriptions, timelines and process outlines are indicative. They describe how
            we usually work, not a binding commitment. Anything specific to your project, including
            scope, price and schedule, is confirmed in writing before work starts.
          </p>

          <h2>Ownership</h2>
          <p>
            The Krestkore name, logo and the content of this site belong to {site.name}. Third-party
            names and marks shown on this site remain the property of their owners and appear only
            to identify the products and organisations we work with.
          </p>

          <h2>Availability</h2>
          <p>
            We aim to keep this site available, but we do not guarantee uninterrupted access, and we
            are not liable for losses arising from it being unavailable or from reliance on general
            information published here.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of the Federal Republic of Nigeria, and disputes
            fall to the courts of Lagos State.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
