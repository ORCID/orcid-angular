/// <reference types="cypress" />

import userData from '../../fixtures/testing_users.json'

describe('Primary account email verification reminders', async function () {
  beforeEach(() => {
    cy.visit('/')
  })

  /* registered user has not verified primary account email, gets reminder
    in scope: check the user gets the reminder email with correct link
    out of scope: this test case will not click on the link so states remains the same */
  it('Receive reminder email if primary account email has not been verified', function () {
    //click Sign in
    cy.get('#menu-signin-button').click()

    //sign in with registered user
    cy.log(
      'Signing in with user: ' + userData.cyUser_primaryEmailNotVerified.oid
    )
    cy.get('#username')
      .clear()
      .type(userData.cyUser_primaryEmailNotVerified.oid)
    cy.get('#password')
      .clear()
      .type(userData.cyUser_primaryEmailNotVerified.password)
    cy.get('#signin-button').click()

    //request to get reminder email to verify primary account email

    cy.get('[class="row resend-verification"]')
      .get('[mat-raised-button]')
      .contains('Resend')
      .click()

    //use gmail api to check verification email was sent
    cy.task('readAllMessages', {
      options: {
        from: Cypress.env('senderVerifyEmail'),
        to: userData.email,
        subject: Cypress.env('verifyEmailReminderSubject'),
        include_body: true,
      },
    }).then((emails) => {
      //there may be multiple emails with same subject and sender
      assert.isNotNull(emails.length)

      //grab most recent email
      const emailBody = emails[0].body.html
      cy.log('>>>>>>>>>Email body is: ' + JSON.stringify(emails[0].body))

      //convert string to DOM
      const htmlDom = new DOMParser().parseFromString(emailBody, 'text/html')

      //href points to correct endpoint
      cy.get(htmlDom.querySelector('[id$="verificationButton"]'))
        .invoke('attr', 'href')
        .should('include', Cypress.env('verifyEmailUrl'))
    })

    //sign out
    cy.get('app-user-menu').click()
    cy.get('#cdk-overlay-1').within(($menu) => {
      cy.get('.mat-menu-item').contains('Logout').click()
    })
  })
})
