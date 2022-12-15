import { defineConfig } from 'cypress'

export default defineConfig({
  blockHosts: ['*.crazyegg.com', '*.zendesk.com'],
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
    membersAPI_allFundingsEndpoint: '/fundings',
    membersAPI_workEndpoint: '/work',
    membersAPI_allWorksEndpoint: '/works',
    membersAPI_peerReviewEndpoint: '/peer-review',
    membersAPI_employmentEndpoint: '/employment',
    membersAPI_allEmploymentsEndpoint: '/employments',
    membersAPI_notifPermEndpoint: '/notification-permission',
    membersAPI_researchEndpoint:'/research-resource',
    membersAPI_allResearchEndpoint:'/research-resources',
    registrationPage: 'https://qa.orcid.org/register',
    membersAPI_revokeTokenEndPoint: 'https://qa.orcid.org/oauth/revoke',
    reactivationEmailSubject: '[ORCID] Reactivating your ORCID record',
    reactivationEmailSender: 'reset@notify.orcid.org',
    reactivationEmailLink: 'https://qa.orcid.org/reactivation/',
    deactivationEmailSubject:
      '[ORCID] Confirm deactivation of your ORCID Account',
    deactivationEmailSender: 'deactivate@notify.orcid.org',
    deactivationEmailLink:
      'https://qa.orcid.org/account/confirm-deactivate-orcid',
    deactivationBannerMessage: 'An account deactivation email has been sent to',
    deactivatedRecordMessage:
      'A deactivated ORCID record is associated with this email address',
  },
  video: false,
  chromeWebSecurity: false,
  viewportWidth: 1000,
  viewportHeight: 1000,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    overwrite: false,
    quiet: true,
    html: false,
    json: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    reportDir: 'cypress/reports/mochawesome-report',
    reportPageTitle: 'Orcid Automated Regression Test Results',
    reportFileName: '[status]_[daytime]-[name]-report',
    timestamp: 'longDate',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      if (config.isTextTerminal) {
        // skip the all.cy.js spec in "cypress run" mode
        require('./cypress/plugins/index.js')(on, config)
        require('cypress-mochawesome-reporter/plugin')(on)
        return {
          excludeSpecPattern: [
            '**/registry/all-registry.cy.js',
            '**/my-orcid/all-add.cy.js',
            '**/my-orcid/all-other-features.cy.js',
            '**/oauth/all-oauth.cy.js',
          ],
        }
      }
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://qa.orcid.org',
    excludeSpecPattern: [
      '**/legacy_oldScripts/*',
      '**/registry/gmail_check_test_ignore.js',
    ],
  },
})
