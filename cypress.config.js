const { defineConfig } = require('cypress');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://bugbank.netlify.app',
    specPattern: 'cypress/e2e/features/**/*.feature',
    screenshotsFolder: 'docs/evidencias',
    retries: {
      runMode: 2,
      openMode: 0,
    },
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 120000,
    requestTimeout: 15000,
    responseTimeout: 30000,
    slowTestThreshold: 10000,
    waitForAnimations: false,
    video: false,
    screenshotOnRunFailure: false,
    numTestsKeptInMemory: 0,
    chromeWebSecurity: false,
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        'file:preprocessor',
        createBundler({ plugins: [createEsbuildPlugin(config)] })
      );
      return config;
    },
  },
});
