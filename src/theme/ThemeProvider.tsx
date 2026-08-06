import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  readInitialTheme,
  ThemeContext,
  THEME_STORAGE_KEY,
  type Theme,
  type ThemeContextValue,
} from './theme-context'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [{ theme, isSystem }, setState] = useState(readInitialTheme)

  // Mirror state onto the document so CSS and the browser chrome both follow.
  useEffect(() => {
    document.documentElement.dataset['theme'] = theme
  }, [theme])

  // While the visitor has not chosen, track the OS preference live.
  useEffect(() => {
    if (!isSystem) return
    const query = window.matchMedia('(prefers-color-scheme: light)')
    const sync = (event: MediaQueryListEvent) => {
      setState({ theme: event.matches ? 'light' : 'dark', isSystem: true })
    }
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [isSystem])

  const setTheme = useCallback((next: Theme) => {
    setState({ theme: next, isSystem: false })
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Persistence is a nicety; the toggle still works for this session.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setState((current) => {
      const next: Theme = current.theme === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {
        // Ignored, as above.
      }
      return { theme: next, isSystem: false }
    })
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, isSystem, setTheme, toggleTheme }),
    [theme, isSystem, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
