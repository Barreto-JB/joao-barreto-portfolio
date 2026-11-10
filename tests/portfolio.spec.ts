import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('traduz a página e mantém a preferência após recarregar', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT')
  await expect(page.getByRole('heading', { name: 'O que construo' })).toBeVisible()
  await page.getByRole('button', { name: /English/ }).click()
  await expect(page.getByRole('heading', { name: 'What I build' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'What I build' })).toBeVisible()
})

test('abre detalhes por teclado e restaura o projeto por ligação direta', async ({ page }) => {
  await page.goto('/#construo')
  const project = page.getByRole('article', { name: 'Visualizador de Escalas' })
  const toggle = project.getByText('Detalhes técnicos', { exact: true })
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(project.getByText('Problema', { exact: true })).toBeVisible()
  await expect(page).toHaveURL(/projeto=escalas#construo/)
  await page.reload()
  await expect(project.getByText('Problema', { exact: true })).toBeVisible()
  await toggle.focus()
  await page.keyboard.press('Space')
  await expect(project.getByText('Problema', { exact: true })).toBeHidden()
})

test('menu móvel dá acesso às secções e fecha com Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Mais secções' })
  await menu.click()
  await expect(page.getByRole('link', { name: 'Trajetória' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('link', { name: 'Trajetória' })).toBeHidden()
  await expect(menu).toBeFocused()
  await menu.click()
  await page.getByRole('link', { name: 'Trajetória' }).click()
  await expect(page).toHaveURL(/#trajetoria$/)
  await expect(page.getByRole('link', { name: 'Trajetória' })).toBeHidden()
})

test('copia a ligação disponível e comunica o resultado', async ({ page, context, baseURL }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/#contacto')
  await page.getByRole('button', { name: 'Copiar ligação do portefólio' }).click()
  await expect(page.getByText('Ligação copiada.', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(new URL('/', baseURL).href)
})

for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
  test(`mantém o conteúdo dentro do ecrã a ${width}px em PT e EN`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('João Barreto')
    for (const language of ['pt-PT', 'en']) {
      if (language === 'en') await page.getByRole('button', { name: /English/ }).click()
      await page.evaluate(() => document.fonts.ready)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    }
  })
}

test('o teclado revela a ligação para saltar para o conteúdo', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Saltar para o conteúdo' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
})

for (const [width, height] of [[1024, 800], [1440, 960]]) {
  test(`a dock atualiza a secção ativa e deixa espaço para o idioma a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/#construo')
    await page.getByRole('button', { name: /English/ }).click()
    const nav = page.getByRole('navigation')
    const dock = (await nav.boundingBox())!
    const lang = (await page.getByRole('group', { name: 'Language' }).boundingBox())!
    expect(dock.x + dock.width).toBeLessThan(lang.x)
    for (const destination of ['construo', 'projetos', 'stack', 'trajetoria', 'sobre', 'contacto', 'inicio']) {
      const link = nav.locator(`[href="#${destination}"]:visible`)
      await link.click()
      await expect(page).toHaveURL(new RegExp(`#${destination}$`))
      await expect(link).toHaveAttribute('aria-current', 'location')
    }
  })
}

test('permite pausar o Canvas e respeita a preferência do sistema', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Pausar animações' }).click()
  await expect(page.getByRole('button', { name: 'Retomar animações' })).toBeVisible()
  const canvas = page.locator('canvas')
  await page.mouse.move(0, 0)
  const capture = () => canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL())
  const paused = await capture()
  await expect.poll(async () => {
    await new Promise(resolve => setTimeout(resolve, 160))
    return (await capture()) === paused
  }, { timeout: 1000 }).toBe(true)
  await page.getByRole('button', { name: 'Retomar animações' }).click()
  await expect(page.getByRole('button', { name: 'Pausar animações' })).toBeVisible()
  await expect.poll(capture).not.toBe(paused)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.getByRole('button', { name: 'Pausar animações' })).toBeHidden()
})

for (const [width, language] of [[390, 'pt'], [1440, 'en']] as const) {
  test(`auditoria axe a ${width}px em ${language.toUpperCase()}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/?projeto=escalas#construo')
    if (language === 'en') await page.getByRole('button', { name: /English/ }).click()
    await expect(page.locator('#detalhes-escalas')).toBeVisible()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })
}

test('anima a órbita do monograma e o cursor e permite pausar ambos', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const cursor = page.locator('.terminal-cursor')
  const orbit = page.locator('.monogram-orbit')
  const animationStates = () => Promise.all([cursor, orbit].map(target =>
    target.evaluate(element => element.getAnimations().map(animation => animation.playState)),
  ))

  await expect.poll(animationStates).toEqual([['running'], ['running']])
  await page.getByRole('button', { name: /Pausar animações/ }).click()
  await expect.poll(animationStates).toEqual([['paused'], ['paused']])
  await page.getByRole('button', { name: /Retomar animações/ }).click()
  await expect.poll(animationStates).toEqual([['running'], ['running']])
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect.poll(animationStates).toEqual([[], []])
})
