const { IterableDiffers } = require('@angular/core')
const runInfo = require('../helpers/runInfo')

describe('Notifications' + runInfo(), () => {
  it('Display a user with no-notifications', () => {})
  describe('Permission notifications', () => {
    // Docs to trigger these notifications:
    // https://github.com/ORCID/orcid-model/tree/master/src/main/resources/notification_3.0#notifications-permission-xml
  })
  describe('Amended notifications', () => {
    // It should report items added, deleted or update on each of the following sections
    // | 'AFFILIATION'
    // | 'BIO'
    // | 'EDUCATION'
    // | 'EMPLOYMENT'
    // | 'EXTERNAL_IDENTIFIERS'
    // | 'FUNDING'
    // | 'PEER_REVIEW'
    // | 'PREFERENCES'
    // | 'UNKNOWN'
    // | 'RESEARCH_RESOURCE'
    // | 'WORK'
    // | 'INVITED_POSITION'
    // NOTE: Further description of what each item can contain is required
  })
  describe('Institutional connect', () => {
    // The environment should have defined an Oauth account with the IDP defined as https://samltest.id/saml/idp
    // related know issues
    // https://trello.com/c/la8Ptj3C/7146-institutional-connect-breaks-the-notifications
    // https://trello.com/c/fMFBon2m/7147-institutional-connect-allows-multiples-apps-to-own-the-same-idp
    // https://trello.com/c/4UcbCqOR/7148-institutional-connect-notifications-are-not-send-for-new-registrations

    // More info at `INSTITUTIONAL CONNECT VIA IDP WORKFLOW` on https://members.orcid.org/api/integrate/institutional-connect
    it('Sends notifications after a user links a new account', () => {})
    it('Sends notifications after a user links a new account through an Oauth process', () => {})
    it('Sends notifications after a user links an existing account', () => {})
    it('Sends notifications after a user links an existing account through an Oauth process', () => {})
  })
  describe('HTML notifications', () => {
    it('Sends a notifications on an account delegation', () => {})
    // Note: further description is required to test other HTML notifications
  })
  it('The paginator can handle N notifications', () => {})
  it('can archived a notification', () => {})
  it('can select and archive multiple notifications', () => {})
  it('wont shown archived notifications by default', () => {})
  it('show archived notifications after the "Show archived" link is clicked', () => {})
  it('shows the application side bar')
})

// For all tests
// Expect unread notifications number to be displayed on the user menu
// Expect notifications titles dates and colors to be as expected
// check accessibility
