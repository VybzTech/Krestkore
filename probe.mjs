import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
await page.evaluate(() => document.getElementById('services')?.scrollIntoView())
await page.waitForTimeout(2000)

const info = await page.evaluate(() => {
  const section = document.getElementById('services')
  const grid = section?.querySelector('div[class*="grid"]')
  const article = section?.querySelector('article')
  const header = article?.querySelector('div[class*="cardHeader"]')
  const h3 = article?.querySelector('h3')
  if (!grid || !article || !h3) return { error: 'missing', grid: !!grid, article: !!article }
  const cs = getComputedStyle(h3)
  return {
    gridClass: grid.className,
    articleClass: article.className,
    headerClass: header?.className ?? null,
    h3Class: h3.className,
    h3Text: h3.textContent,
    h3Opacity: cs.opacity,
    h3AnimationName: cs.animationName,
    h3AnimationDelay: cs.animationDelay,
    h3AnimationDuration: cs.animationDuration,
    h3AnimationFill: cs.animationFillMode,
    revealDelayVar: cs.getPropertyValue('--reveal-delay'),
  }
})

console.log(JSON.stringify(info, null, 2))
await browser.close()
