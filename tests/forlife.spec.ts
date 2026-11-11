import { expect, test } from '@playwright/test'

test('preserves execution when switching languages and pauses on a connector', async ({ page }) => {
  test.setTimeout(60000)
  await page.goto('/#forlife-cloud-wallet')
  const simulation = page.locator('.fl-console')
  await simulation.getByRole('button', { name: 'Iniciar simulação' }).click()
  await expect(simulation.locator('.fl-wire--desktop .fl-particle')).toHaveCount(1)
  await simulation.getByRole('button', { name: 'Pausar' }).click()
  await expect(simulation.locator('.fl-run-state')).toContainText('Em pausa')
  await page.getByRole('button', { name: /English/ }).click()
  await expect(simulation.locator('.fl-run-state')).toContainText('Paused')
  await simulation.getByRole('button', { name: 'Resume' }).click()
  await expect(simulation.locator('.fl-run-state')).toHaveText('Completed', { timeout: 42000 })
  await expect(simulation.locator('.fl-pass')).toContainText('DEMO-CODE-001')
  await expect(simulation.getByRole('button', { name: 'Replay' })).toBeVisible()
})

const scenarios = [
  { value: '0', code: 'DEMO-CODE-001', result: '"submitted": true' },
  { value: '1', code: 'DEMO-CODE-001', result: '"reason": "already_booked"' },
  { value: '2', code: 'DEMO-CODE-001', result: '"reason": "waiting"' },
  { value: '3', code: 'DEMO-CODE-002', result: '"submitted": true' },
  { value: '4', code: null, result: '503 Service Unavailable' },
]

for (const { value, code, result } of scenarios) {
  test('runs deterministic scenario ' + value + ' without transport', async ({ page }) => {
    const calls: string[] = []
    page.on('request', request => {
      if (/example\.invalid|googleapis\.com/.test(request.url())) calls.push(request.url())
    })
    await page.goto('/#forlife-cloud-wallet')
    const simulation = page.locator('.fl-console')
    await simulation.getByLabel('Cenário').selectOption(value)
    if (value === '3') await expect(simulation.locator('.fl-pass')).toContainText('Código anterior expirado')
    const next = simulation.getByRole('button', { name: 'Próximo passo' })
    for (let i = 0; i < (code ? 11 : 3); i++) await next.click()
    await expect(simulation.locator('.fl-run-state')).toHaveText(code ? 'Concluído' : 'Falhou')
    if (code) await expect(simulation.locator('.fl-pass')).toContainText(code)
    else await expect(simulation.locator('.fl-pass')).toContainText('Por sincronizar')
    await simulation.getByRole('button', { name: code ? /Submeter reserva/ : /Sessão/ }).click()
    await simulation.getByRole('button', { name: 'Ver resposta' }).click()
    await expect(simulation.locator('pre')).toContainText(result)
    await simulation.getByRole('button', { name: 'Ver código' }).click()
    await expect(simulation.locator('pre')).toContainText(code ? 'submitIllustrativeBooking' : 'initializeDemoSession')
    await simulation.getByRole('button', { name: 'Reiniciar' }).click()
    await expect(simulation.locator('.fl-run-state')).toHaveText('À espera')
    expect(calls).toEqual([])
  })
}

test('positions the inspector beneath the selected mobile node', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#forlife-cloud-wallet')
  const node = page.getByRole('button', { name: /Código de identificação/ })
  await node.click()
  const inspector = page.locator('.fl-inspect-layout')
  const [nodeBox, inspectorBox] = await Promise.all([node.boundingBox(), inspector.boundingBox()])
  expect(inspectorBox!.y).toBeGreaterThanOrEqual(nodeBox!.y + nodeBox!.height)
  expect(inspectorBox!.y - (nodeBox!.y + nodeBox!.height)).toBeLessThan(24)
  await expect(inspector.getByText('MemberGetIdentifCode', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page).toHaveURL(/#forlife-cloud-wallet$/)
  await expect(page.getByRole('heading', { name: 'Automatizar uma rotina. Integrar vários sistemas.' })).toBeVisible()
})

test('follows the live nodes, responses and final pass without manual scrolling on a small phone', async ({ page }) => {
  test.setTimeout(60000)
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/#forlife-cloud-wallet')
  const simulation = page.locator('.fl-console')
  await simulation.getByRole('button', { name: 'Iniciar simulação' }).click()
  const progress = simulation.locator('progress')
  const response = simulation.locator('pre')
  const toolbar = simulation.locator('.fl-toolbar')
  await expect(progress).toHaveAttribute('value', '1')
  await expect(response).toContainText('"trigger": "scheduled"')
  await expect(response).toBeInViewport({ ratio: 1 })
  const scroll = await page.evaluate(() => window.scrollY)
  const booking = simulation.getByRole('button', { name: /Submeter reserva/ })
  await expect(booking).toHaveAttribute('aria-pressed', 'true', { timeout: 24000 })
  await expect(booking).toBeInViewport({ ratio: 1 })
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(scroll)
  await expect(toolbar).toBeInViewport({ ratio: 1 })
  await expect(progress).toHaveAttribute('value', '6')
  await expect(response).toContainText('"submitted": true')
  await expect(response).toBeInViewport({ ratio: 1 })
  await expect(simulation.locator('.fl-run-state')).toHaveText('Concluído', { timeout: 22000 })
  const pass = simulation.locator('.fl-pass')
  await expect(pass).toContainText('DEMO-CODE-001')
  await expect(pass).toBeInViewport({ ratio: 1 })
  await expect(toolbar.getByRole('button', { name: 'Repetir' })).toBeInViewport({ ratio: 1 })
  const [controls, wallet, dock] = await Promise.all([toolbar.boundingBox(), pass.boundingBox(), page.locator('.dock').boundingBox()])
  expect(wallet!.y).toBeGreaterThan(controls!.y + controls!.height)
  expect(wallet!.y + wallet!.height).toBeLessThan(dock!.y)
})
