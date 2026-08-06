/**
 * Renders a 24x24 brand path as a real SVG element.
 *
 * The Angular build stored these as HTML strings and pushed them through
 * `DomSanitizer.bypassSecurityTrustHtml` + `[innerHTML]`. JSX renders SVG
 * natively, so the sanitizer bypass is gone entirely.
 */
export function Glyph({
  path,
  size = 16,
  className,
  title,
}: {
  path: string
  size?: number
  className?: string
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={path} />
    </svg>
  )
}
