import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { site } from '../../data/site'
import { ChatAgent } from './ChatAgent'
import { topics } from './script'

function mockFetch(response: Partial<Response> = {}) {
  const fn = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}), ...response })
  vi.stubGlobal('fetch', fn)
  return fn
}

/**
 * Kris asks a random number of follow-ups, so the test walks the flow by
 * reacting to whatever is on screen rather than assuming a fixed script.
 */
async function walkToName(user: ReturnType<typeof userEvent.setup>, topicLabel = 'Networking') {
  await user.click(screen.getByRole('button', { name: 'Work with us' }))
  await user.click(screen.getByRole('button', { name: topicLabel }))

  /*
   * Always answer the newest question. AnimatePresence keeps the outgoing
   * group mounted for a beat, so picking the first match on the page can hit a
   * button that is already on its way out.
   */
  for (let guard = 0; guard < 10; guard += 1) {
    if (screen.queryByPlaceholderText('Your name')) return
    const groups = document.querySelectorAll<HTMLElement>('[class*="options"]')
    const newest = groups[groups.length - 1]
    const next = newest?.querySelector('button')
    if (!next) break
    await user.click(next)
  }
  throw new Error('Never reached the name step')
}

describe('<ChatAgent />', () => {
  beforeEach(() => {
    mockFetch()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  it('opens from a launcher labelled for partnership, not support', () => {
    render(<ChatAgent />)
    expect(screen.getByRole('button', { name: 'Work with us' })).toBeInTheDocument()
  })

  it('asks for the name and the email in separate turns', async () => {
    const user = userEvent.setup()
    render(<ChatAgent />)
    await walkToName(user)

    // Name is asked first, on its own.
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('you@company.com')).not.toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Your name'), 'Jane Doe')
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Only then does the email step appear, and the name step retires.
    expect(await screen.findByPlaceholderText('you@company.com')).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.queryByPlaceholderText('Your name')).not.toBeInTheDocument(),
    )
  })

  it('will not advance past an empty name', async () => {
    const user = userEvent.setup()
    render(<ChatAgent />)
    await walkToName(user)

    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/name/i)
    expect(screen.queryByPlaceholderText('you@company.com')).not.toBeInTheDocument()
  })

  it('emails the enquiry directly instead of filling a form', async () => {
    const user = userEvent.setup()
    render(<ChatAgent />)
    await walkToName(user)

    await user.type(screen.getByPlaceholderText('Your name'), 'Jane Doe')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.type(screen.getByPlaceholderText('you@company.com'), 'jane@company.com')
    await user.click(screen.getByRole('button', { name: /send to the team/i }))

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    const [url, init] = vi.mocked(fetch).mock.calls[0]!
    expect(url).toBe(site.formspreeEndpoint)

    const body = JSON.parse(String(init?.body)) as Record<string, string>
    expect(body.name).toBe('Jane Doe')
    expect(body.email).toBe('jane@company.com')
    expect(body.source).toBe('Kris chat')
    const networking = topics.find((topic) => topic.label === 'Networking')
    expect(body.service).toBe(networking?.service)
    expect(body.message).toContain('Timeline:')

    expect(await screen.findByText(/sent\./i)).toBeInTheDocument()
  })

  it('rejects a malformed email without calling the network', async () => {
    const user = userEvent.setup()
    render(<ChatAgent />)
    await walkToName(user)

    await user.type(screen.getByPlaceholderText('Your name'), 'Jane Doe')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.type(screen.getByPlaceholderText('you@company.com'), 'nope')
    await user.click(screen.getByRole('button', { name: /send to the team/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/email/i)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('keeps the visitor on the email step when sending fails', async () => {
    mockFetch({ ok: false, json: async () => ({ errors: [{ message: 'Form is disabled' }] }) })
    const user = userEvent.setup()
    render(<ChatAgent />)
    await walkToName(user)

    await user.type(screen.getByPlaceholderText('Your name'), 'Jane Doe')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.type(screen.getByPlaceholderText('you@company.com'), 'jane@company.com')
    await user.click(screen.getByRole('button', { name: /send to the team/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/form is disabled/i)
    // Their answers survive so they can retry rather than start over.
    expect(screen.getByPlaceholderText('you@company.com')).toHaveValue('jane@company.com')
  })
})
