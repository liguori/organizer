import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run */
  timeout: 60 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Reporter to use. */
  reporter: 'list',
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL used for navigation in tests. */
    baseURL: 'http://localhost:4200',
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    /* Screenshot settings */
    screenshot: 'off',
    /* Viewport for desktop screenshots */
    viewport: { width: 1440, height: 900 },
  },
  /* Configure projects for desktop and mobile captures */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 14'],
        hasTouch: true,
      },
    },
  ],
  /* Output directory for screenshots */
  outputDir: path.join(__dirname, '..', 'docs', 'playwright-results'),
  /* Run the Angular dev server before tests */
  webServer: {
    command: 'npm start',
    cwd: path.join(__dirname, '..', 'src', 'Organizer.SPA'),
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
