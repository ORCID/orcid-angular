import { defineConfig } from 'cypress'

export default defineConfig({
  env: {
    infoSiteBaseUrl: 'https://info.qa.orcid.org',
    duplicatedModalEndPoint: 'https://pub.qa.orcid.org/v3.0/expanded-search/**',
    verifyEmailSubject: '[ORCID] Welcome to ORCID - verify your email address',
    verifyEmailUrl: 'https://qa.orcid.org/verify-email/',
    senderVerifyEmail: 'support@verify.orcid.org',
    verifyEmailReminderSubject:
      '[ORCID] Reminder to verify your primary email address',
    senderResetPassword: 'reset@notify.orcid.org',
    forgotPasswordSubject: '[ORCID] About your password reset request',
    recoverOIDSubject: '[ORCID] Your ORCID iD',
    resetPasswEmailURL: 'https://qa.orcid.org/reset-password-email/',
    signInURL: 'https://qa.orcid.org/signin',
    membersAPI_URL: 'https://api.qa.orcid.org/v3.0/',
    membersAPI_websitesEndPoint: '/researcher-urls',
    membersAPI_fundingsEndpoint: '/funding',
    membersAPI_workEndpoint: '/work',
    membersAPI_peerReviewEndpoint: '/peer-review',
    registrationPage: 'https://qa.orcid.org/register',
  },
  chromeWebSecurity: false,
  viewportWidth: 1000,
  viewportHeight: 1000,
  reporter: 'mochawesome',
  reporterOptions: {
    charts: true,
    overwrite: false,
    html: true,
    json: false,
    reportDir: 'cypress/reports/temp/mochawesome-report',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://qa.orcid.org',
    excludeSpecPattern: [
      '**/legacy_oldScripts/*',
      '**/registry/gmail_check_test_ignore.js',
    ],
  },
})
