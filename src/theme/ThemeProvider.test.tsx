import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { THEME_STORAGE_KEY } from './theme-context'
import { ThemeProvider } from './ThemeProvider'

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.dataset['theme'] = 'dark'
  })

  it('defaults to dark and exposes switch state', () => {
    renderToggle()
    expect(document.documentElement.dataset['theme']).toBe('dark')
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles the document theme and persists the choice', async () => {
    const user = userEvent.setup()
    renderToggle()

    await user.click(screen.getByRole('switch'))
    expect(document.documentElement.dataset['theme']).toBe('light')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')

    await user.click(screen.getByRole('switch'))
    expect(document.documentElement.dataset['theme']).toBe('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('restores a persisted theme on mount', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light')
    renderToggle()
    expect(document.documentElement.dataset['theme']).toBe('light')
  })
})
