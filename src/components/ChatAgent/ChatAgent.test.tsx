import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EnquiryProvider } from '../../enquiry/EnquiryProvider'
import { Contact } from '../Contact/Contact'
import { ChatAgent } from './ChatAgent'

function renderPair() {
  return render(
    <EnquiryProvider>
      <ChatAgent />
      <Contact />
    </EnquiryProvider>,
  )
}

/** Walks Kris from the launcher to the lead-capture step. */
async function qualify(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Chat with Kris' }))
  await user.click(screen.getByRole('button', { name: 'Networking' }))
  await user.click(screen.getByRole('button', { name: 'Multiple branches' }))
  await user.click(screen.getByRole('button', { name: 'Within a month' }))
}

describe('<ChatAgent />', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }))
    // jsdom has no smooth scrolling.
    Element.prototype.scrollIntoView = vi.fn()
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(0)
      return 0
    }) as typeof window.requestAnimationFrame
  })

  it('walks through the branching flow one step at a time', async () => {
    const user = userEvent.setup()
    renderPair()

    await user.click(screen.getByRole('button', { name: 'Chat with Kris' }))
    expect(screen.getByText(/what can we help with/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Networking' }))
    expect(screen.getByText(/what is the site like/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Multiple branches' }))
    expect(screen.getByText(/how soon do you need this/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Within a month' }))
    expect(screen.getByLabelText('Your name')).toBeInTheDocument()
  })

  it('lets the visitor step back without losing the flow', async () => {
    const user = userEvent.setup()
    renderPair()
    await qualify(user)

    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByText(/how soon do you need this/i)).toBeInTheDocument()
  })

  it('refuses to hand off an invalid email', async () => {
    const user = userEvent.setup()
    renderPair()
    await qualify(user)

    await user.type(screen.getByLabelText('Your name'), 'Jane Doe')
    await user.type(screen.getByLabelText('Email', { exact: true }), 'nope')
    await user.click(screen.getByRole('button', { name: /send to the team/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/valid email/i)
    expect(screen.getByLabelText(/full name/i)).toHaveValue('')
  })

  it('pre-fills the contact form with the qualified enquiry', async () => {
    const user = userEvent.setup()
    renderPair()
    await qualify(user)

    await user.type(screen.getByLabelText('Your name'), 'Jane Doe')
    await user.type(screen.getByLabelText('Email', { exact: true }), 'jane@company.com')
    await user.click(screen.getByRole('button', { name: /send to the team/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue('Jane Doe')
    })
    expect(screen.getByLabelText(/email address/i)).toHaveValue('jane@company.com')
    expect(screen.getByLabelText(/service interest/i)).toHaveValue('Networking & Infrastructure')
    const message = screen.getByLabelText(/^message$/i) as HTMLTextAreaElement
    expect(message.value).toContain('Networking & Infrastructure')
    expect(message.value).toContain('Multiple branches')
    expect(message.value).toContain('within a month')
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
  })
})
