import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://proyecto.yamycorp.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    downloadsFolder: 'cypress/downloads',
    
    // Viewport
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    
    // Screenshots and Videos
    video: process.env.CI ? true : false, // Enable videos in CI, disable in development
    videoCompression: 32,
    screenshotOnRunFailure: true,
    
    // Retries
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    // Reporter configuration
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
      charts: true,
      reportPageTitle: 'CRÍTICO E2E Test Report',
      embeddedScreenshots: true,
      inlineAssets: true,
      reportFilename: '[status]_[datetime]-report',
      timestamp: 'longDate',
    },
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
});
