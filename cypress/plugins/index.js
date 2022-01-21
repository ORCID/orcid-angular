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
const debug = require("debug");
const path = require("path");
const gmail_tester = require("gmail-tester-extended");
const tokenFileName = "token.json";//credentials.json is inside plugins/ directory
const credentialsFileName = "credentials.json";//token.json is inside plugins/ directory 

module.exports = (on, config) => {
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push('--disable-gpu');
      return launchOptions
    }
  });
  
  on("task", {
    "readAllMessages": async args => {
      console.log('si entró al task en el index file'); 
      const messages = await gmail_tester.get_messages(
        path.resolve(__dirname, credentialsFileName),
        path.resolve(__dirname, tokenFileName),
        args.options
      );
      return messages;
    }
  });

  on("task", {
    "checkInbox_from_to_subject": async args => { 
      //console.log('si entró al task en el index file');
      //console.log("********************"+JSON.stringify(args)); 
      const { from, to, subject } = args.options;
      //console.log("options are: "+ from + to + subject);
      const email = await gmail_tester.check_inbox(
        path.resolve(__dirname, credentialsFileName), 
        path.resolve(__dirname, tokenFileName), 
        subject,
        from,
        to,
        10,                                          // Poll interval (in seconds)
        15                                           // Maximum poll interval (in seconds). If reached, return null, indicating the completion of the task().
      );
      console.log(`This is email: ${JSON.stringify(email)}`)
      return email;
    }
  });
};
