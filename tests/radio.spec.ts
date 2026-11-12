import { expect, test } from '@playwright/test'

const titles = ['Morning Coffee', 'Warm Fuzz', 'City Lights', 'A Little Shade', 'Peaceful Drift']

test('keeps the desktop player below the navigation while scrolling', async ({ page }) => {
  for (const width of [1000, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, 650))
    const nav = page.getByRole('navigation')
    const radio = page.getByRole('complementary', { name: 'Rádio JB' })
    await expect.poll(async () => {
      const menu = (await nav.boundingBox())!
      const player = (await radio.boundingBox())!
      return menu.y >= 0 && menu.y + menu.height <= player.y
    }).toBe(true)
    await radio.getByRole('button', { name: 'Fila de reprodução' }).click()
    await expect(radio.getByRole('region', { name: 'Fila de reprodução' })).toBeVisible()
  }
})

test.use({ launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] } })

test('starts on entry, plays all five tracks and keeps the controls above the page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const audio = page.locator('audio')
  const radio = page.getByRole('complementary', { name: 'Rádio JB' })
  await expect(radio.getByRole('button', { name: 'Pausar rádio' })).toBeVisible()
  await expect(audio).toHaveAttribute('src', /morning-coffee[.]mp3$/)
  await radio.getByRole('button', { name: 'Fila de reprodução' }).click()
  const queue = page.getByRole('region', { name: 'Fila de reprodução' })

  for (const title of titles) {
    const track = queue.getByRole('button', { name: title, exact: true })
    await track.click()
    await expect(track).toHaveAttribute('aria-current', 'true')
    await expect.poll(() => audio.evaluate(element => {
      const media = element as HTMLAudioElement
      return !media.paused && media.readyState >= 2 && media.duration > 120
    })).toBe(true)
  }

  await audio.evaluate(element => {
    const media = element as HTMLAudioElement
    media.currentTime = media.duration - .04
  })
  await expect(queue.getByRole('button', { name: titles[0], exact: true })).toHaveAttribute('aria-current', 'true')
  await expect(radio.getByRole('button', { name: 'Pausar rádio' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(queue).toBeHidden()
  await page.getByRole('navigation').getByRole('link', { name: 'Projetos' }).click()
  await expect(page).toHaveURL(/#construo$/)
  await expect.poll(async () => (await radio.boundingBox())?.y).toBe(0)
  expect(await audio.evaluate(element => (element as HTMLAudioElement).paused)).toBe(false)

  await radio.getByRole('button', { name: 'Pausar rádio' }).click()
  await expect(radio.getByRole('button', { name: 'Reproduzir' })).toBeVisible()
  await page.getByRole('navigation').getByRole('link', { name: 'Início' }).click()
  expect(await audio.evaluate(element => (element as HTMLAudioElement).paused)).toBe(true)
  await page.reload()
  await expect(radio.getByRole('button', { name: 'Pausar rádio' })).toBeVisible()
})
test('uses the first ordinary interaction after autoplay is blocked and translates the controls', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('joao-portfolio-radio', JSON.stringify({ index: 2, volume: .55 }))
    const play = HTMLMediaElement.prototype.play
    HTMLMediaElement.prototype.play = function () {
      if (!navigator.userActivation.hasBeenActive) return Promise.reject(new DOMException('Autoplay blocked', 'NotAllowedError'))
      return play.call(this)
    }
  })
  await page.goto('/')
  const audio = page.locator('audio')
  await expect(audio).toHaveAttribute('src', /city-lights[.]mp3$/)
  expect(await audio.evaluate(element => (element as HTMLAudioElement).paused)).toBe(true)
  await page.getByRole('button', { name: /English/ }).click()
  const radio = page.getByRole('complementary', { name: 'JB Radio' })
  await expect(radio.getByRole('slider', { name: 'Radio volume' })).toHaveValue('55')
  await expect(radio.getByRole('button', { name: 'Pause radio' })).toBeVisible()
  await radio.getByRole('button', { name: 'Mute radio' }).click()
  expect(await audio.evaluate(element => (element as HTMLAudioElement).muted)).toBe(true)
  await radio.getByRole('button', { name: 'Pause radio' }).click()
  expect(await audio.evaluate(element => (element as HTMLAudioElement).paused)).toBe(true)
})
