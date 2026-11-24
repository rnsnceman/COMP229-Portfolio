import { defineConfig } from 'cypress';
export default defineConfig({
  video: true,
  screenshotOnRunFailure: true,
  videosFolder: 'artifacts/cypress/videos',
  screenshotsFolder: 'artifacts/cypress/screenshots',
  viewportWidth: 1280,
  viewportHeight: 900,
  e2e: {
    baseUrl: 'http://127.0.0.1:5010',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') launchOptions.args.push('--no-sandbox');
        return launchOptions;
      });
    },
  },
});
