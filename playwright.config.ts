import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import dotenv from 'dotenv';

const projectRoot = path.resolve(__dirname);

dotenv.config({ path: path.join(projectRoot, '.env') });

export default defineConfig({
  testDir: './src/tests',
  timeout: 120000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  workers: 1,

  // Do not rerun failed tests
  retries: 0,

  maxFailures: 0,

  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright'],
  ],

  use: {
    baseURL:
      process.env.BASE_URL || 'https://moviesandtv.myvi.in/',

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    headless: true,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    //  },
    // {
    //   name: 'edge',
    //   use: {
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge',
    //   },
    // },
  ],
});