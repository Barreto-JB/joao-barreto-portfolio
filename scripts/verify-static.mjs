import assert from 'node:assert/strict'
import { chromium, devices, webkit } from '@playwright/test'

const base = new URL(process.argv[2] ?? 'http://127.0.0.1:4179/')
const canonical = process.argv[3]
const browser = await chromium.launch()

try {
  const page = await browser.newPage({ javaScriptEnabled: false })
  const response = await page.goto(base.href)
  assert.equal(response?.status(), 200)
  assert.equal(await page.getByRole('heading', { level: 1 }).textContent(), 'João Barreto')
  assert.equal(await page.locator('main > section').count(), 7)

  if (canonical) {
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), canonical)
    const socialImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    assert.equal(socialImage, new URL('partilha.png', canonical).href)
    const localImage = await page.request.get(new URL('partilha.png', base).href)
    assert.match(localImage.headers()['content-type'], /image\/png/)
    const sitemap = await page.request.get(new URL('sitemap.xml', base).href)
    assert.match(sitemap.headers()['content-type'], /xml/)
    assert.ok((await sitemap.text()).includes(`<loc>${canonical}</loc>`))
  }

  console.log('HTML pré-renderizado verificado com JavaScript desligado.')
} finally {
  await browser.close()
}

const safari = await webkit.launch()
try {
  const page = await safari.newPage({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
  await page.goto(base.href)
  await page.locator('.local-clock time[datetime]').waitFor()
  await page.evaluate(() => document.fonts.ready)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390)

  await page.getByRole('button', { name: /English/ }).tap()
  await page.getByRole('button', { name: 'More sections' }).tap()
  await page.getByRole('link', { name: 'Timeline' }).tap()
  assert.equal(new URL(page.url()).hash, '#trajetoria')
  await page.getByRole('link', { name: 'Projects', exact: true }).tap()
  const card = page.getByRole('article', { name: 'Shift Schedule Viewer' })
  await card.getByRole('button', { name: 'Technical details' }).tap()
  await card.getByText('Problem', { exact: true }).waitFor()
  await card.locator('img').evaluate(image => image.decode())
  assert.deepEqual(errors, [])
  console.log('Navegação e detalhes por toque verificados em WebKit com emulação iPhone (390 px).')
} finally {
  await safari.close()
}
