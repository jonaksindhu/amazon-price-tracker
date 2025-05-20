// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  use: {
    headless: false,
    slowMo: 100,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30000,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'accept-language': 'en-US,en;q=0.9',
      'sec-ch-ua': '"Chromium";v="120", "Google Chrome";v="120", ";Not A Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
    },
    launchOptions: {
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    },
  },
  reporter: [
    ['html'],
    ['list']
  ],
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        channel: 'chrome',
      },
    },
  ],
}); 