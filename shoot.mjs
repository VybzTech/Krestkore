import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = process.argv[2] ?? './shots'
const BASE = 'http://localhost:4173'
mkdirSync(OUT, { recursive: true })

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'desktop', width: 1440, height: 900 },
]

const browser = await chromium.launch()
const problems = []

for (const theme of ['dark', 'light']) {
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    page.on('console', (m) => {
      if (m.type() === 'error') problems.push(`[${theme}/${vp.name}] console: ${m.text()}`)
    })
    page.on('pageerror', (e) => problems.push(`[${theme}/${vp.name}] pageerror: ${e.message}`))

    await page.addInitScript((t) => localStorage.setItem('krestkore-theme', t), theme)
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)

    // Horizontal overflow check.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    if (overflow > 1) problems.push(`[${theme}/${vp.name}] horizontal overflow: ${overflow}px`)

    await page.screenshot({ path: `${OUT}/${theme}-${vp.name}-top.png` })

    // Scroll through the page so lazy reveals fire, then capture key sections.
    for (const id of ['services', 'testimonials', 'about', 'contact']) {
      await page.evaluate((sel) => document.getElementById(sel)?.scrollIntoView(), id)
      await page.waitForTimeout(700)
      await page.screenshot({ path: `${OUT}/${theme}-${vp.name}-${id}.png` })
    }

    // Footer.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${OUT}/${theme}-${vp.name}-footer.png` })

    await context.close()
  }
}

// Contrast audit on the light theme, which is newly derived.
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()
await page.addInitScript(() => localStorage.setItem('krestkore-theme', 'light'))
await page.goto(BASE, { waitUntil: 'networkidle' })

const contrast = await page.evaluate(() => {
  const lum = (rgb) => {
    const [r, g, b] = rgb.map((v) => {
      const s = v / 255
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const parse = (c) => (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
  const bgOf = (el) => {
    let node = el
    while (node) {
      const bg = getComputedStyle(node).backgroundColor
      const p = parse(bg)
      const alpha = Number((bg.match(/[\d.]+/g) ?? [])[3] ?? 1)
      if (p.length === 3 && alpha > 0.5) return p
      node = node.parentElement
    }
    return [255, 255, 255]
  }
  const results = []
  const nodes = document.querySelectorAll('p, a, span, h1, h2, h3, li, label, button, small')
  for (const el of nodes) {
    const text = el.textContent?.trim()
    if (!text || el.children.length > 0) continue
    const style = getComputedStyle(el)
    if (style.visibility === 'hidden' || style.display === 'none') continue
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue
    const fg = parse(style.color)
    const bg = bgOf(el)
    const l1 = lum(fg)
    const l2 = lum(bg)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    const size = parseFloat(style.fontSize)
    const bold = Number(style.fontWeight) >= 700
    const large = size >= 24 || (size >= 18.66 && bold)
    const min = large ? 3 : 4.5
    if (ratio < min) {
      results.push({
        text: text.slice(0, 45),
        ratio: Number(ratio.toFixed(2)),
        min,
        size: Math.round(size),
        color: style.color,
      })
    }
  }
  return results
})

await browser.close()

console.log('=== CONSOLE / OVERFLOW PROBLEMS ===')
console.log(problems.length ? problems.join('\n') : 'none')
console.log('\n=== LIGHT THEME CONTRAST FAILURES ===')
console.log(contrast.length ? JSON.stringify(contrast, null, 2) : 'none')
