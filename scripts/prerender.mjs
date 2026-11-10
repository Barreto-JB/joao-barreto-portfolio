import { readFile, writeFile } from 'node:fs/promises'
import { loadEnv } from 'vite'
import { render } from '../.prerender/entry-static.js'

const dist = new URL('../dist/', import.meta.url)
const index = new URL('index.html', dist)
const template = await readFile(index, 'utf8')
const env = loadEnv('production', process.cwd())
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
let metadata = ''

if (env.VITE_SITE_URL) {
  const url = new URL(env.VITE_SITE_URL)
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('VITE_SITE_URL deve ser um endereço HTTP(S) público, sem autenticação, parâmetros ou fragmento.')
  }
  if (!url.pathname.endsWith('/')) url.pathname += '/'

  const canonical = escape(url.href)
  const image = escape(new URL('partilha.png', url).href)
  const sitemap = new URL('sitemap.xml', url)
  metadata = [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="João Barreto, desenvolvimento e automação" />',
    `<meta name="twitter:image" content="${image}" />`,
  ].join('\n    ')

  await writeFile(new URL('sitemap.xml', dist),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${canonical}</loc></url></urlset>\n`)
  if (url.pathname === '/') {
    await writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\nSitemap: ${sitemap.href}\n`)
  }
}

if (!template.includes('<!-- portfolio -->')) throw new Error('O HTML base está sem o marcador do portefólio.')
await writeFile(index, template.replace('<!-- portfolio -->', () => render()).replace('<!-- public-metadata -->', metadata))
console.log('HTML estático gerado em dist/index.html.')
