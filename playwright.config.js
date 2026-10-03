const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  use: { channel: 'chrome', baseURL: 'http://127.0.0.1:4173', reducedMotion: 'reduce' },
  webServer: { command: 'node scripts/serve.mjs', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
});
