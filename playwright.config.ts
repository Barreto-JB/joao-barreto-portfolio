import { defineConfig } from '@playwright/test'

const productionUrl = process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 3,
  use: { baseURL: productionUrl ?? 'http://127.0.0.1:4178', browserName: 'chromium' },
  webServer: productionUrl ? undefined : {
    command: 'npm run dev -- --host 127.0.0.1 --port 4178 --strictPort',
    url: 'http://127.0.0.1:4178',
    reuseExistingServer: !process.env.CI,
  },
})
