import { mkdir } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const output = process.argv[2] ?? 'docs/capturas'
const url = process.argv[3] ?? 'http://127.0.0.1:4179/'
await mkdir(output, { recursive: true })
const browser = await chromium.launch()

try {
  for (const [width, height] of [[390, 844], [768, 960], [1440, 960]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    page.on('response', response => { if (!response.ok() && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })

    await page.goto(url)
    await page.evaluate(() => document.fonts.ready)
    await page.locator('.local-clock time[datetime]').waitFor()
    await page.screenshot({ path: `${output}/inicio-${width}.png` })

    const featured = page.getByRole('article').first()
    await featured.scrollIntoViewIfNeeded()
    await featured.locator('img').evaluate(image => image.decode())
    await featured.screenshot({ path: `${output}/projeto-${width}.png` })

    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded()
      await image.evaluate(element => element.decode())
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.locator('.dock a[href="#inicio"][aria-current="location"]:visible').waitFor()
    await page.screenshot({ path: `${output}/pagina-${width}.png`, fullPage: true })
    if (errors.length) throw new Error(`${width}px: ${errors.join('\n')}`)
    await page.close()
    console.log(`Capturas verificadas a ${width}px.`)
  }
} finally {
  await browser.close()
}
