/// <reference types="cypress" />
import userData from '../../fixtures/testing-users.fixture.json'

describe('Account Settings - users can activate 2FA for their record', async function () {
  before(() => {
    cy.visit('/')
  })

  it('Verify 2FA is requested during login if user previously activated 2FA', function () {
    cy.get('#menu-signin-button').click()
    //verify user is redirected to the sign in page
    cy.url().should('include', '/signin')
    cy.get('#username').clear().type(userData.cy2FAuser.oid)
    cy.get('#password').clear().type(userData.cy2FAuser.password)
    cy.get('#signin-button').click()
    //verify 2FA is requested during login
    cy.get('[formcontrolname="verificationCode"]').should('be.visible')
  })

  after(() => {
    //no action required, user was not abe to log in
  })
})
