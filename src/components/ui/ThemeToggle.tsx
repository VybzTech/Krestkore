import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../theme/useTheme'
import styles from './ThemeToggle.module.css'

/**
 * Two-state theme switch. Exposed as a real switch to assistive tech, so the
 * current state is announced rather than inferred from the icon.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      onClick={toggleTheme}
      data-theme={theme}
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
    >
      <span className={styles.thumb} aria-hidden="true" />
      <span className={`${styles.slot} ${styles.moon}`} aria-hidden="true">
        <Moon strokeWidth={2} />
      </span>
      <span className={`${styles.slot} ${styles.sun}`} aria-hidden="true">
        <Sun strokeWidth={2} />
      </span>
    </button>
  )
}
