// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,    // retry once locally, 2 times on CI
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['list'], 
    ['html', { outputFolder: 'reports', open: 'never' }]
  ],
  
  use: {
    headless: false,                     // show browser window (change to true if you want headless)
    //baseURL: 'https://www.amazon.in',   // set base URL for all tests
    screenshot: 'only-on-failure',       // take screenshot if test fails
    video: 'retain-on-failure',           // keep video on failure
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Uncomment and configure if you need local server start for tests
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
