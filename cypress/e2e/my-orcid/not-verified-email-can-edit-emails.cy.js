/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('User without verified primary email address can edit emails section', async function () {
  const addEmail = 'cypressusertesting@orcid.org'

  before(() => {
    cy.visit('/')
  })

  qase(
    '108',
    it('User without verified primary email address can edit emails section', function () {
      //click Sign in
      cy.get('#menu-signin-button').click()

      //sign in with registered user
      cy.get('#username')
        .clear()
        .type(userData.cyUserPrimaryEmailNotVerified.oid)
      cy.get('#password')
        .clear()
        .type(userData.cyUserPrimaryEmailNotVerified.password)
      cy.get('#signin-button').click()

      //click on edit pencil for Emails section
      cy.get('#emails-panel').within(($myPanel) => {
        cy.get('.cy-edit-button').click()
      })

      cy.get('#add-link').click()

      cy.get('#newEmailInput1').clear().type(addEmail)
      cy.get('#save-emails-button').wait(1000).click()

      //verify the keyword is displayed
      cy.get('#emails-panel')
        .within(($section) => {
          cy.get('[class="line"]')
        })
        .should('contain', addEmail)

      //clean up state
      cy.cleanEmails()
    })
  ) //end of qase tag
  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
