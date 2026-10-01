import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  use: { baseURL: 'http://127.0.0.1:4180', channel: 'chrome', screenshot: 'only-on-failure' },
  webServer: { command: 'npm run dev -- --host 127.0.0.1 --port 4180', url: 'http://127.0.0.1:4180', reuseExistingServer: false },
})
