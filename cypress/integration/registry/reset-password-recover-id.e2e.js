/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'

describe('Password reset and OID recovery', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it.skip('User resets password', function () {
    const newPassword = '12345678Ab'

    //click Sign in
    cy.get('#menu-signin-button').click()
    //click forgot password link
    cy.get('#forgot-password-button').click()
    //select password recovery option
    cy.get('[value="resetPassword"]').should('be.selected').click()
    //type email
    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.cyUserPrimaryEmaiVerified.email)
    //click button to recover details
    cy.get('button').contains('RECOVER ACCOUNT DETAILS').click()

    //use gmail api to check recovery email was sent
    cy.task('readAllMessages', {
      options: {
        from: Cypress.env('senderResetPassword'),
        to: userData.cyUserPrimaryEmaiVerified.email,
        subject: Cypress.env('forgotPasswordSubject'),
        include_body: true,
      },
    }).then((emails) => {
      //there may be multiple emails with same subject and sender
      assert.isNotNull(emails.length)
      //grab most recent email
      const emailBody = emails[0].body.html
      //cy.log(">>>>>>>>>Email body is: "+ JSON.stringify(emails[0].body))
      //convert string to DOM
      const htmlDom = new DOMParser().parseFromString(emailBody, 'text/html')
      cy.log(htmlDom.documentElement.innerHTML)

      //find the link that starts pointing to the correct endpoint
      const href = htmlDom.querySelector(
        '[href^=Cypress.env("resetPasswEmailURL")]'
      ).href
      cy.log('>>>>>>>found the link: ' + href)
    })
    //follow the link from the email
    cy.visit(href)
    //type new passw
    cy.get('#passwordField').clear().type(newPassword)
    //confirm new passw
    cy.get('#retypedPassword').clear().type(newPassword)
    //save
    cy.get('#reg-form-password').within(($form) => {
      cy.get('button').click()
    })
    //verify user is redirected to Sign in page
    cy.url().should('contain', Cypress.env(signInURL))

    //Verify user can sign in with new passw
    cy.get('username').clear().type(userData.cyUserPrimaryEmailNotVerified.oid)
    cy.get('password').clear().type(newPassword)
    cy.get('#signin-button').click()

    /* CLEAN UP FOR FUTURE RUNS */
    //change passw to original value
    cy.get('app-user-menu').click()
    cy.get('#cdk-overlay-0').within(($menu) => {
      cy.get('.mat-menu-item').contains('Account settings').click()
    })
    //edit passw and save

    //sign out
    cy.get('app-user-menu').click()
    cy.get('#cdk-overlay-0').within(($menu) => {
      cy.get('.mat-menu-item').contains('Logout').click()
    })
  })

  it('User recovers OID', function () {
    //click Sign in
    cy.get('#menu-signin-button').click()
    //click forgot password link
    cy.get('#forgot-password-button').click()
    //select OID recovery option
    cy.get('[value="remindOrcidId"]').click()
    //type email
    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.cyUserPrimaryEmaiVerified.email)
    //click button to recover details
    cy.get('button').contains('RECOVER ACCOUNT DETAILS').click()

    //use gmail api to check recovery email was sent
    cy.task('checkInbox_from_to_subject', {
      options: {
        from: Cypress.env('senderResetPassword'),
        to: userData.cyUserPrimaryEmaiVerified.email,
        subject: Cypress.env('recoverOIDSubject'),
        include_body: true,
      },
    }).then((email) => {
      assert.isNotNull(email)
      const emailBody = email.body.html
      //convert string to DOM
      const htmlDom = new DOMParser().parseFromString(emailBody, 'text/html')
      //find the link that contains user OID
      const href = htmlDom.querySelector(
        `a[href*='${userData.cyUserPrimaryEmaiVerified.oid}']`
      ).href
      cy.log('>>>>>>>found the link: ' + href)
      //follow the link from the email
      cy.visit(href)
    })
    //verify user is redirected to their public page
    cy.url().should('contain', userData.cyUserPrimaryEmaiVerified.oid)
  })
})
