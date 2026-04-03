import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  testMatch: ['**/token-usage.spec.ts', '**/api-status-codes.spec.ts'],
  testIgnore: [],
  webServer: {
    command: 'node demo-app/token-demo/server.js',
    port: 3000,
    reuseExistingServer: true,
    timeout: 30_000,
  },
  use: {
    ...baseConfig.use,
    baseURL: 'http://127.0.0.1:3000',
  },
});
