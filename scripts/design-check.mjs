/**
 * Automated design check.
 *
 * Usage:  npm run preview   (in another shell)
 *         npm run design-check [outDir]
 *
 * Captures both themes across three viewports, exercises interaction states
 * (hover / focus / open menu / open chat), and reports:
 *   - console errors and page errors
 *   - elements overflowing the viewport (body has overflow-x:hidden, which
 *     hides this from scrollWidth, so boxes are measured directly)
 *   - elements clipped by an ancestor's overflow while hovered
 *   - WCAG AA contrast failures, skipping gradient-clipped text whose
 *     computed colour is transparent and therefore unmeasurable
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = process.argv[2] ?? './design-shots'
const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
mkdirSync(OUT, { recursive: true })

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'desktop', width: 1440, height: 900 },
]
const THEMES = ['dark', 'light']
const SECTIONS = ['services', 'testimonials', 'about', 'contact']

const problems = []
const note = (msg) => problems.push(msg)

/** Elements whose box escapes the viewport, ignoring deliberate off-screen UI. */
const OVERFLOW_PROBE = () => {
  const vw = document.documentElement.clientWidth
  const out = []
  const clipped = (el) => {
    for (let n = el.parentElement; n; n = n.parentElement) {
      const o = getComputedStyle(n)
      if (o.overflow !== 'visible' || o.overflowX !== 'visible') return true
      if (n.getAttribute('aria-hidden') === 'true') return true
    }
    return false
  }
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el)
    if (cs.position === 'fixed' || cs.visibility === 'hidden' || cs.display === 'none') continue
    if (cs.filter !== 'none' || cs.pointerEvents === 'none') continue
    if (el.closest('[inert]') || el.closest('[aria-hidden="true"]')) continue
    if (clipped(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (r.right > vw + 1 || r.left < -1) {
      out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)} right=${Math.round(r.right)} vw=${vw}`)
    }
  }
  return out.slice(0, 5)
}

/** Contrast audit. Skips text painted by a gradient clip (colour is transparent). */
const CONTRAST_PROBE = () => {
  const lum = (rgb) => {
    const [r, g, b] = rgb.map((v) => {
      const s = v / 255
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const nums = (c) => (c.match(/[\d.]+/g) ?? []).map(Number)
  const bgOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor
      const p = nums(bg)
      if (p.length >= 3 && (p[3] ?? 1) > 0.5) return p.slice(0, 3)
    }
    return [255, 255, 255]
  }
  const out = []
  // Only leaf text nodes, but reached through elements that have children too.
  for (const el of document.querySelectorAll('p,a,span,h1,h2,h3,h4,li,label,button,small,em,strong,dt,dd')) {
    const own = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join('')
    if (!own) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.15) continue
    // Gradient-clipped text renders from the background image, not `color`.
    if (cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)' || nums(cs.color)[3] === 0) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (r.bottom < 0 || r.top > innerHeight) continue
    const fg = nums(cs.color).slice(0, 3)
    const l1 = lum(fg)
    const l2 = lum(bgOf(el))
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    const size = parseFloat(cs.fontSize)
    const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700)
    const min = large ? 3 : 4.5
    if (ratio < min) {
      out.push({ text: own.slice(0, 40), ratio: +ratio.toFixed(2), min, color: cs.color })
    }
  }
  return out
}

/** After hovering, is the element's box cut off by an ancestor's clip? */
const CLIP_PROBE = (selector) => {
  const el = document.querySelector(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  for (let n = el.parentElement; n; n = n.parentElement) {
    const cs = getComputedStyle(n)
    if (cs.overflow === 'visible' && cs.overflowY === 'visible') continue
    const p = n.getBoundingClientRect()
    if (r.bottom > p.bottom + 0.5 || r.top < p.top - 0.5) {
      return `clipped by ${n.tagName.toLowerCase()}.${String(n.className).slice(0, 24)} (el ${Math.round(r.top)}-${Math.round(r.bottom)} vs box ${Math.round(p.top)}-${Math.round(p.bottom)})`
    }
  }
  return null
}

const browser = await chromium.launch()

for (const theme of THEMES) {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    const page = await ctx.newPage()
    const tag = `${theme}/${vp.name}`

    page.on('console', (m) => m.type() === 'error' && note(`[${tag}] console: ${m.text()}`))
    page.on('pageerror', (e) => note(`[${tag}] pageerror: ${e.message}`))

    await page.addInitScript((t) => localStorage.setItem('krestkore-theme', t), theme)
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1400)

    for (const o of await page.evaluate(OVERFLOW_PROBE)) note(`[${tag}] overflow: ${o}`)
    await page.screenshot({ path: `${OUT}/${theme}-${vp.name}-01-hero.png` })

    for (const [i, id] of SECTIONS.entries()) {
      await page.evaluate((s) => document.getElementById(s)?.scrollIntoView(), id)
      await page.waitForTimeout(1500)
      for (const f of await page.evaluate(CONTRAST_PROBE)) {
        note(`[${tag}] contrast ${f.ratio}:1 (needs ${f.min}) "${f.text}" ${f.color}`)
      }
      for (const o of await page.evaluate(OVERFLOW_PROBE)) note(`[${tag}] overflow @${id}: ${o}`)
      await page.screenshot({ path: `${OUT}/${theme}-${vp.name}-0${i + 2}-${id}.png` })
    }

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${OUT}/${theme}-${vp.name}-06-footer.png` })

    await ctx.close()
  }
}

// ── Interaction states ──────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => note(`[hover] pageerror: ${e.message}`))
  await page.addInitScript(() => localStorage.setItem('krestkore-theme', 'dark'))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)

  // Nav + toggle hover/focus.
  await page.getByRole('link', { name: 'Get Started' }).hover()
  await page.waitForTimeout(350)
  await page.screenshot({ path: `${OUT}/hover-01-nav-cta.png`, clip: { x: 700, y: 0, width: 740, height: 90 } })

  await page.getByRole('switch').focus()
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${OUT}/hover-02-theme-focus.png`, clip: { x: 900, y: 0, width: 540, height: 90 } })

  // Service card hover.
  await page.evaluate(() => document.getElementById('services')?.scrollIntoView())
  await page.waitForTimeout(1500)
  await page.locator('#services article').first().hover()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/hover-03-service-card.png` })

  // Carousel controls: the classic clipped-on-scale case.
  await page.evaluate(() => document.getElementById('testimonials')?.scrollIntoView())
  await page.waitForTimeout(1500)
  const next = page.getByRole('button', { name: 'Next testimonial' })
  await next.hover()
  await page.waitForTimeout(400)
  const clip = await page.evaluate(CLIP_PROBE, '#testimonials button[aria-label="Next testimonial"]')
  if (clip) note(`[hover] next-testimonial ${clip}`)
  await page.screenshot({ path: `${OUT}/hover-04-carousel-controls.png` })

  // Form focus ring + submit hover.
  await page.evaluate(() => document.getElementById('contact')?.scrollIntoView())
  await page.waitForTimeout(1500)
  await page.getByLabel('Full name').focus()
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${OUT}/hover-05-field-focus.png` })
  await page.getByRole('button', { name: /send message/i }).hover()
  await page.waitForTimeout(350)
  await page.screenshot({ path: `${OUT}/hover-06-submit.png` })

  // Footer socials.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(700)
  await page.getByRole('link', { name: /on Instagram/i }).hover()
  await page.waitForTimeout(350)
  await page.screenshot({ path: `${OUT}/hover-07-social.png` })

  await ctx.close()
}

// ── Mobile menu, opened AFTER scrolling ─────────────────────────────────
// The header only gains backdrop-filter once scrolled, and backdrop-filter
// creates a containing block for fixed descendants. Opening the menu at
// scrollY 0 does not reproduce the scrim bug.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  await page.addInitScript(() => localStorage.setItem('krestkore-theme', 'dark'))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo(0, 900))
  await page.waitForTimeout(700)
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.waitForTimeout(700)

  const scrim = await page.evaluate(() => {
    const el = document.querySelector('[class*="scrim"]')
    if (!el) return { error: 'no scrim' }
    const r = el.getBoundingClientRect()
    return { top: Math.round(r.top), height: Math.round(r.height), vh: innerHeight }
  })
  if (scrim.error) note(`[menu] ${scrim.error}`)
  else if (scrim.height < scrim.vh - 2) {
    note(`[menu] scrim only ${scrim.height}px tall, viewport is ${scrim.vh}px`)
  }
  await page.screenshot({ path: `${OUT}/menu-01-open-scrolled.png` })

  // Tapping the scrim must close the drawer.
  await page.mouse.click(30, 400)
  await page.waitForTimeout(600)
  const stillOpen = await page.evaluate(() => {
    const d = document.getElementById('primary-menu')
    return d ? !d.hasAttribute('inert') : false
  })
  if (stillOpen) note('[menu] clicking the scrim did not close the drawer')
  await page.screenshot({ path: `${OUT}/menu-02-after-outside-click.png` })

  await ctx.close()
}

// ── Kris flow end to end ────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => note(`[kris] pageerror: ${e.message}`))
  await page.addInitScript(() => localStorage.setItem('krestkore-theme', 'light'))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Chat with Kris' }).click()
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: 'Networking', exact: true }).click()
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: 'Multiple branches' }).click()
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: 'Within a month' }).click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/kris-01-capture.png` })
  await page.getByLabel('Your name').fill('Jane Doe')
  await page.getByLabel('Email', { exact: true }).fill('jane@company.com')
  await page.getByRole('button', { name: /send to the team/i }).click()
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${OUT}/kris-02-prefilled-form.png` })

  const filled = await page.evaluate(() => {
    const val = (label) => {
      const el = Array.from(document.querySelectorAll('label')).find((l) =>
        l.textContent.trim().toLowerCase().startsWith(label),
      )
      if (!el) return null
      const field = document.getElementById(el.getAttribute('for'))
      return field ? field.value : null
    }
    return { name: val('full name'), email: val('email address'), message: val('message') }
  })
  if (!filled.name || !filled.email || !filled.message) {
    note(`[kris] hand-off did not fill the form: ${JSON.stringify(filled)}`)
  }
  await ctx.close()
}

await browser.close()

console.log('\n=== DESIGN CHECK ===')
console.log(problems.length ? problems.join('\n') : 'no problems found')
console.log(`\nshots: ${OUT}`)
