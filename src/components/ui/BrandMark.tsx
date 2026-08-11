import { useState } from 'react'

/**
 * The Krestkore logo.
 *
 * Drop a file at `public/assets/brand/logo.svg` and it is used automatically.
 * Until then, and if that file ever 404s, this falls back to the built-in
 * double-chevron so the header can never render empty.
 */
const CUSTOM_LOGO = '/assets/brand/logo.svg'

export function BrandMark({ size = 36, className }: { size?: number; className?: string }) {
  const [useFallback, setUseFallback] = useState(false)

  if (!useFallback) {
    return (
      <img
        src={CUSTOM_LOGO}
        alt=""
        width={size}
        height={size}
        className={className}
        style={{ height: size, width: 'auto', objectFit: 'contain' }}
        onError={() => setUseFallback(true)}
        aria-hidden="true"
      />
    )
  }

  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 6L18 18L6 30"
        stroke="var(--accent)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 6L26 18L14 30"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  )
}
