/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'

describe('Password reset and OID recovery', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('User resets password', function () {
    const newPassword = userData.cyResetPasswordUser.resetPasswordTo

    //click Sign in
    cy.get('#menu-signin-button').click()
    //click forgot password link
    cy.get('#forgot-password-button').click()
    //password option is selected by default, type email
    cy.get('[formcontrolname="email"]') // REPLACE locator for cy id
      .clear()
      .type(userData.cyResetPasswordUser.email)
    //click button to recover details
    cy.get('#cy-recover-acc-details').click()
    cy.wait(2000)

    //use gmail api to check recovery email was sent
    cy.task('checkInbox_from_to_subject', {
      options: {
        from: Cypress.env('senderResetPassword'),
        to: userData.cyResetPasswordUser.email,
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
    cy.wait(3000)
    //type new passw
    cy.contains('There is a problem with your reset password link.').should(
      'not.exist'
    )
    cy.get('#cy-password-input').clear().type(newPassword)
    //confirm new passw
    cy.get('#cy-password-confirm-input').clear().type(newPassword)
    //save
    //cy.wait(2000)
    cy.get('#cy-save-password').should('be.enabled').click({ force: true })

    //verify user is redirected to Sign in page
    cy.url().should('contain', Cypress.env('signInURL'))

    //Verify user can sign in with new passw
    cy.get('#username').clear().type(userData.cyResetPasswordUser.oid)
    cy.get('#password').clear().type(newPassword)
    cy.get('#signin-button').click()
    //verify user is redirected to their my orcid page
    cy.url().should('contain', userData.cyResetPasswordUser.oid)

    //sign out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click()
  })

  it('User recovers OID', function () {
    //click Sign in
    cy.get('#menu-signin-button').click()
    //click forgot password link
    cy.get('#forgot-password-button').click()
    //select OID recovery option
    cy.get('[value="remindOrcidId"]').click()
    //type email
    cy.get('[formcontrolname="email"]') // REPLACE locator for cy id
      .clear()
      .type(userData.cyResetPasswordUser.email)
    //click button to recover details
    cy.get('#cy-recover-acc-details').click()

    //use gmail api to check recovery email was sent
    cy.task('checkInbox_from_to_subject', {
      options: {
        from: Cypress.env('senderResetPassword'),
        to: userData.cyResetPasswordUser.email,
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
        `a[href*='${userData.cyResetPasswordUser.oid}']`
      ).href
      cy.log('>>>>>>>found the link: ' + href)
      //follow the link from the email
      cy.visit(href)
    })
    //verify user is redirected to their public record page
    cy.url().should('contain', userData.cyResetPasswordUser.oid)
  })
})
