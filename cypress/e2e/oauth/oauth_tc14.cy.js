/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#14
pre-condition: record without valid access token
1 - visit authorization link
2 - click password reset link
3 - visit password reset link
4 - complete password reset form
5 - sign in with new password
expected: user is taken to authorization screen
6 - click button to grant access
result: user is taken to redirect_uri appended with authorization code
 */

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC14
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=/activities/update%20/person/update&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri
  const newPassword = 'test1234'

  before(() => {
    cy.visit(authorizationLink)
  })

  it('TC#14 reset password from auth link', function () {
    cy.wait(2000) //intentional wait for page to fully load
    cy.get('#forgot-password-button').click()
    cy.get('[formcontrolname="email"]').clear().type(recordOwner.email)
    cy.get('#cy-recover-acc-details').click()
    cy.wait(2000) //intentional wait for page to fully load

    //use gmail api to check recovery email was sent
    cy.task('checkInbox_from_to_subject', {
      options: {
        from: Cypress.env('senderResetPassword'),
        to: recordOwner.email,
        subject: Cypress.env('forgotPasswordSubject'),
        include_body: true,
      },
    }).then((email) => {
      assert.isNotNull(email)
      const emailBody = email.body.html
      //convert string to DOM
      const htmlDom = new DOMParser().parseFromString(emailBody, 'text/html')
      cy.log(htmlDom.documentElement.innerHTML)
      //find the link that starts pointing to the correct endpoint
      const href = htmlDom.querySelector(`a[id*='cy-pwd-reset-url']`).href
      //follow the link from the email
      cy.visit(href)
    })

    //type new passw
    cy.get('#cy-password-input').clear().type(newPassword)
    //confirm new passw
    cy.get('#cy-password-confirm-input').clear().type(newPassword)
    //save
    cy.get('#cy-save-password').click()
    //verify user is redirected to Sign in page
    cy.url().should('contain', Cypress.env('signInURL'))

    //Verify user can sign in with new passw
    cy.get('#username').clear().type(recordOwner.oid)
    cy.get('#password').clear().type(newPassword)
    cy.get('#signin-button').click()

    //verify user taken to my orcid instead of authorization screen
    cy.url().then((urlString) => {
      cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
  })

  after(() => {})
})
