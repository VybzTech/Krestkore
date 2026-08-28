/**
 * Regenerates every favicon from the brand logo.
 *
 *   npm run favicons
 *
 * Replaces the old Python/Pillow scripts in angular-legacy, which drew the
 * chevron by hand and could not render an SVG at all. This renders the real
 * logo through a browser, so the icons cannot drift from the brand mark.
 *
 * Outputs:
 *   public/favicon.ico            16 + 32 + 48, for legacy browsers
 *   public/assets/favicon.svg     scalable, preferred by modern browsers
 *   public/assets/favicon-32.png
 *   public/assets/favicon-192.png  Android
 *   public/assets/favicon-512.png  PWA / splash
 *   public/assets/apple-touch-icon.png  180, iOS home screen
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'

const LOGO = 'public/assets/brand/logo-icon.svg'
const NAVY = '#0A1F44'
const TEAL = '#14B8A6'

/* The mark sits on a filled disc rather than transparency: browser tabs range
 * from near-white to near-black, and a bare teal glyph disappears against one
 * or the other. The disc also matches the previous icon's silhouette. */
const LOGO_SCALE = 0.62 // fraction of the canvas the mark occupies
/* Below this size the decorative ring turns to mush and the mark needs more
 * of the disc to stay readable, so small icons get their own treatment. */
const SMALL = 48
const SMALL_SCALE = 0.72

const svgSource = readFileSync(LOGO, 'utf8')
const inner = svgSource
  .replace(/<\?xml[^>]*\?>/, '')
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .trim()

const browser = await chromium.launch()
const page = await browser.newPage()

// Measure the mark's real ink bounds; the artboard has uneven padding, so
// centring on the viewBox alone leaves the glyph visibly off-centre.
await page.setContent(`<body style="margin:0">${svgSource}</body>`)
const ink = await page.evaluate(() => {
  const b = document.querySelector('svg').getBBox()
  return { x: b.x, y: b.y, w: b.width, h: b.height }
})

const S = 512
const glyph = inner.replace(/fill="[^"]*"/g, '')

function buildSvg(px) {
  const small = px <= SMALL
  const frac = small ? SMALL_SCALE : LOGO_SCALE
  const span = Math.max(ink.w, ink.h)
  const scale = (S * frac) / span
  const tx = S / 2 - (ink.x + ink.w / 2) * scale
  const ty = S / 2 - (ink.y + ink.h / 2) * scale
  const ring = small
    ? ''
    : `<circle cx="${S / 2}" cy="${S / 2}" r="${S / 2 - 22}" fill="none" stroke="${TEAL}" stroke-width="4" opacity="0.35"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${px}" height="${px}">
  <circle cx="${S / 2}" cy="${S / 2}" r="${S / 2 - 6}" fill="${NAVY}"/>
  ${ring}
  <g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(5)})" fill="${TEAL}">
${glyph}
  </g>
</svg>
`
}

/* The scalable favicon is used at tab size, so it takes the small treatment. */
writeFileSync('public/assets/favicon.svg', buildSvg(SMALL))

async function render(size) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<body style="margin:0;width:${size}px;height:${size}px">${buildSvg(size)}</body>`,
  )
  return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
}

for (const [size, path] of [
  [32, 'public/assets/favicon-32.png'],
  [180, 'public/assets/apple-touch-icon.png'],
  [192, 'public/assets/favicon-192.png'],
  [512, 'public/assets/favicon-512.png'],
]) {
  writeFileSync(path, await render(size))
  console.log(`wrote ${path} (${size}x${size})`)
}

/* ICO is a container: a 6-byte header, one 16-byte directory entry per image,
 * then the payloads. PNG payloads are valid and understood by every browser
 * that still asks for favicon.ico. */
const icoSizes = [16, 32, 48]
const pngs = []
for (const size of icoSizes) pngs.push(await render(size))

const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // 1 = icon
header.writeUInt16LE(pngs.length, 4)

let offset = 6 + pngs.length * 16
const entries = pngs.map((png, i) => {
  const e = Buffer.alloc(16)
  const size = icoSizes[i]
  e.writeUInt8(size === 256 ? 0 : size, 0)
  e.writeUInt8(size === 256 ? 0 : size, 1)
  e.writeUInt8(0, 2) // palette count
  e.writeUInt8(0, 3) // reserved
  e.writeUInt16LE(1, 4) // colour planes
  e.writeUInt16LE(32, 6) // bits per pixel
  e.writeUInt32LE(png.length, 8)
  e.writeUInt32LE(offset, 12)
  offset += png.length
  return e
})

writeFileSync('public/favicon.ico', Buffer.concat([header, ...entries, ...pngs]))
console.log(`wrote public/favicon.ico (${icoSizes.join(', ')})`)
console.log('wrote public/assets/favicon.svg')

await browser.close()
