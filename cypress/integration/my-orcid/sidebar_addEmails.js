/// <reference types="cypress" />

import userData from '../../fixtures/testing_users.json'

describe('My orcid - users are able to add content to their record', async function () {
  before(() => {
    cy.visit(Cypress.env('signInURL'))
    //sign in
    cy.signin(userData.cyUser_primaryEmaiVerified)
    cy.wait(1000)
  })

  it('User adds secondary Email to their record', function () {
    const addSecondaryEmail = 'qa@orcid.org'
    //click on edit pencil for Emails section
    cy.get('#emails-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })

    cy.get('#add-link').click()

    cy.get('#newEmailInput1').clear().type(addSecondaryEmail)
    cy.get('#save-emails-button').click()
    cy.wait(1000)

    //verify the keyword is displayed
    cy.get('#emails-panel')
      .within(($section) => {
        cy.get('[class="line"]')
      })
      .should('contain', addSecondaryEmail)

    //clean up state
    cy.cleanEmails()

    //sign out
    cy.get('app-user-menu').click()
    cy.get('#cdk-overlay-2').within(($menu) => {
      cy.get('.mat-menu-item').contains('Logout').click()
    })
  })
})
