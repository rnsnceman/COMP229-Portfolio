import { defineConfig } from '@playwright/test';
import { randomBytes } from 'node:crypto';
process.env.TEST_ADMIN_PASSWORD ||= randomBytes(24).toString('base64url');
export default defineConfig({
  timeout: 90000,
  testDir: './tests', testMatch: '**/browser.spec.js', workers: 1,
  use: { baseURL: 'http://127.0.0.1:5000', viewport: { width: 1280, height: 900 }, launchOptions: { args: ['--no-sandbox'] } },
  webServer: { command: 'node tests/serve.js', url: 'http://127.0.0.1:5000/api/health', reuseExistingServer: false, timeout: 60000 },
});
