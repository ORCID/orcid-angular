// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/// <reference types="Cypress" />
const debug = require('debug')
const path = require('path')
const gmail_tester = require('gmail-tester-extended') //node_modules library
const tokenFileName = 'token_qa.json' //token file is inside plugins/ directory
const credentialsFileName = 'credentials_qa.json' //credentials is inside plugins/ directory

module.exports = (on, config) => {
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push('--disable-gpu')
      return launchOptions
    }
  })

  on('task', {
    readAllMessages: async (args) => {
      const messages = await gmail_tester.get_messages(
        path.resolve(__dirname, credentialsFileName),
        path.resolve(__dirname, tokenFileName),
        args.options
      )
      return messages //this task returns an array of emails
    },
  })

  on('task', {
    checkInbox_from_to_subject: async (args) => {
      const { from, to, subject } = args.options
      const email = await gmail_tester.check_inbox(
        path.resolve(__dirname, credentialsFileName),
        path.resolve(__dirname, tokenFileName),
        subject,
        from,
        to,
        10, // Poll interval (in seconds)
        15 // Maximum poll interval (in seconds). If reached, return null, indicating the completion of the task().
      )
      return email //this task returns one email (JSON object)
    },
  })
}
