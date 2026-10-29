// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
//
// Chrome discovery: karma-chrome-launcher honours process.env.CHROME_BIN when
// it is set, and otherwise locates the system Chrome (google-chrome on Linux,
// Google Chrome.app on macOS). GitHub's ubuntu runner images ship
// google-chrome-stable, so CI needs no extra download.
//
// NOTE: this config is consumed by the `@angular/build:karma` (esbuild)
// builder. Do not add the `@angular-devkit/build-angular` framework or its
// karma plugin here: they are webpack-only, and the esbuild builder strips
// them at runtime with a warning.

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'lcovonly' }],
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    browsers: ['Chrome'],

    customLaunchers: {
      ChromeWithFlags: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-translate',
          '--disable-extensions',
          '--ignore-certificate-errors',
        ],
      },
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      },
    },

    singleRun: false,
  })
}
