import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { site } from '../../data/site'
import { Contact } from './Contact'

function fetchMock(response: Partial<Response>) {
  return vi.fn().mockResolvedValue({ ok: true, json: async () => ({}), ...response } as Response)
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), 'Jane Doe')
  await user.type(screen.getByLabelText(/email address/i), 'jane@company.com')
  await user.type(
    screen.getByLabelText(/^message$/i),
    'We need a network refresh across two Lagos offices.',
  )
}

describe('<Contact />', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock({}))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('posts to the configured Formspree endpoint', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    const [url, init] = vi.mocked(fetch).mock.calls[0]!
    expect(url).toBe('https://formspree.io/f/mkjwnyeo')
    expect(url).toBe(site.formspreeEndpoint)
    expect(JSON.parse(String(init?.body))).toMatchObject({
      name: 'Jane Doe',
      email: 'jane@company.com',
    })
  })

  it('shows the success state after a successful post', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/message sent/i)).toBeInTheDocument()
  })

  it('blocks submission and reports invalid fields without calling the network', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/check the email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('aria-invalid', 'true')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('surfaces the server error message when Formspree rejects the post', async () => {
    vi.stubGlobal(
      'fetch',
      fetchMock({
        ok: false,
        json: async () => ({ errors: [{ message: 'Form is disabled' }] }),
      }),
    )
    const user = userEvent.setup()
    render(<Contact />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/form is disabled/i)
  })

  it('reports a network failure instead of failing silently', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const user = userEvent.setup()
    render(<Contact />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not reach the server/i)
  })
})
