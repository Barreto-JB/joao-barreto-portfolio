import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const asset = (path) => readFile(new URL(path, import.meta.url))
const [font, graphic] = await Promise.all([
  asset('../src/assets/fonts/space-mono-700.woff2'),
  asset('../src/assets/monogram.svg'),
])
const browser = await chromium.launch()

try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.setContent(`<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Space Mono'; src: url(data:font/woff2;base64,${font.toString('base64')}); font-weight: 700; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #D9F1EF; background: #0F1F2B; font: 700 26px/1.3 'Space Mono', monospace; }
    main { width: 1200px; height: 630px; display: grid; grid-template-columns: 1fr 410px; align-items: center; gap: 45px; padding: 64px; }
    .label { color: #9AC7C3; font-size: 19px; }
    h1 { font-size: 69px; letter-spacing: -0.06em; line-height: 1.1; margin: 22px 0; }
    p { margin: 0; max-width: 29ch; }
    img { width: 100%; border: 1px solid #416F75; border-radius: 14px; }
    .rule { position: absolute; left: 64px; right: 64px; height: 1px; background: #2B515B; }
    .top { top: 62px; }
    .bottom { bottom: 62px; }
  </style></head><body><main>
    <div class="rule top"></div><div class="rule bottom"></div>
    <div><div class="label">&gt;_ Portefólio</div><h1>João Barreto</h1><p>Desenvolvimento de software e automação</p></div>
    <img alt="" src="data:image/svg+xml;base64,${graphic.toString('base64')}">
  </main></body></html>`)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: fileURLToPath(new URL('../public/partilha.png', import.meta.url)) })
} finally {
  await browser.close()
}
