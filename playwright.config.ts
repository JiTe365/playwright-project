// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const site = process.env.TEST_SITE;

const siteMatch: Record<string, string[]> = {
  saucedemo: ['**/saucedemo-*.spec.ts', '**/saucedemo*.spec.ts'],
  todomvc: ['**/todomvc*.spec.ts'],
};

export default defineConfig({
  testDir: './tests',
  testMatch: site ? (siteMatch[site] ?? ['**/*.spec.ts']) : ['**/*.spec.ts'],

  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
