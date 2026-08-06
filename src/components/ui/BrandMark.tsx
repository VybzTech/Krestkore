/** The Krestkore double-chevron. Inherits colour from the surrounding theme. */
export function BrandMark({ size = 36, className }: { size?: number; className?: string }) {
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
