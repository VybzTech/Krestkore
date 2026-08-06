import { createContext } from 'react'

export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'krestkore-theme'

export interface ThemeContextValue {
  theme: Theme
  /** True until the visitor picks a theme, after which the OS is ignored. */
  isSystem: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

/**
 * Reads the theme the pre-paint script in index.html already committed to, so
 * React's first render agrees with the DOM and nothing flashes.
 */
export function readInitialTheme(): { theme: Theme; isSystem: boolean } {
  if (typeof document === 'undefined') return { theme: 'dark', isSystem: true }

  let stored: string | null = null
  try {
    stored = localStorage.getItem(THEME_STORAGE_KEY)
  } catch {
    // Private mode or blocked storage: fall through to the system preference.
  }

  if (isTheme(stored)) return { theme: stored, isSystem: false }

  const attr = document.documentElement.dataset['theme']
  if (isTheme(attr)) return { theme: attr, isSystem: true }

  return { theme: 'dark', isSystem: true }
}
