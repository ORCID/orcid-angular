// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    browsers: ['ChromeWithFlags', 'ChromeHeadless'],

    customLaunchers: {
      ChromeWithFlags: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-translate',
          '--disable-extensions',
          '--ignore-certificate-errors',
          '--enable-chrome-browser-cloud-management',
        ],
      },
      CustomChrome: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox', // disable OS sandbox
          '--disable-setuid-sandbox', // disable setuid sandbox
          '--disable-translate',
          '--disable-extensions',
          '--remote-debugging-port=9223',
          '--ignore-certificate-errors', // suppress cert parse errors
          '--enable-chrome-browser-cloud-management', // optional: silences the CBCM warning
        ],
      },
    },

    singleRun: false,
  })
}
