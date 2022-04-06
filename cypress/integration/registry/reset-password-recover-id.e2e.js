/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'

describe('Password reset and OID recovery', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('User resets password', function () {
    const newPassword = '12345678Ab'

    //click Sign in
    cy.get('#menu-signin-button').click()
    //click forgot password link
    cy.get('#forgot-password-button').click()
    //password option is selected by default, type email
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
        subject: Cypress.env('forgotPasswordSubject'),
        include_body: true,
      },
    }).then((email) => {
      //there may be multiple emails with same subject and sender
      assert.isNotNull(email)
      //grab most recent email
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
    cy.get('#passwordField').clear().type(newPassword)
    //confirm new passw
    cy.get('#retypedPassword').clear().type(newPassword)
    //save
    cy.get('#reg-form-password').within(($form) => {
      cy.get('button').click()
    })
    //verify user is redirected to Sign in page
    cy.url().should('contain', Cypress.env('signInURL'))
    cy.wait(2000)//intentional wait for page to load

    //Verify user can sign in with new passw
    cy.get('#username').clear().type(userData.cyUserPrimaryEmaiVerified.oid)
    cy.get('#password').clear().type(newPassword)
    cy.get('#signin-button').click()
    cy.wait(2000)//intentional wait for page to load

    //change passw back to original value
    cy.get('#cy-user-info').click()
    cy.wait(1000)//intentional wait for page to load
    cy.get('#cy-account-settings').click()
    cy.wait(1000)//intentional wait for page to load
    cy.contains(' Account password ').click()//TO DO: replace with element id once it is added
    cy.get('[formcontrolname="oldPassword"]').clear().type(newPassword)
    cy.get('[formcontrolname="password"]').clear().type(userData.cyUserPrimaryEmaiVerified.password)
    cy.get('[formcontrolname="retypedPassword"]').clear().type(userData.cyUserPrimaryEmaiVerified.password)
    cy.get('#save-password').click()

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
      const href = htmlDom.querySelector(`a[href*='${userData.cyUserPrimaryEmaiVerified.oid}']`).href
      cy.log('>>>>>>>found the link: ' + href)
      //follow the link from the email
      cy.visit(href)
    })
    //verify user is redirected to their public page
    cy.url().should('contain', userData.cyUserPrimaryEmaiVerified.oid)
  })
})
