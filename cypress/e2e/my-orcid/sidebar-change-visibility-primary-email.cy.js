/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'

describe('My orcid - users are able to add content to their record', async function () {
  before(() => {
    cy.visit(Cypress.env('signInURL'))
    //sign in
    cy.signin(userData.cyUserPrimaryEmaiVerified)
    cy.wait(1000)
  })

  it('User changes visibility to the primary email account', function () {
    //click on edit pencil for Emails section
    cy.get('#emails-panel').within(($myPanel) => {
      cy.get('.cy-edit-button').click()
    })

    //set visibility to public
    //TO DO: use id for public button instead of class
    cy.get('#modal-container').within(($myModal) => {
      cy.get('.cy-visibility-public').click()
    })
    //save changes
    cy.get('#save-emails-button').click()
    //verify change
    cy.get('app-panel-privacy').should('have.attr', 'aria-label', 'PUBLIC')

    //revert back to PRIVATE visibility
    cy.get('#emails-panel').within(($myPanel1) => {
      cy.get('.cy-edit-button').click()
    })
    //TO DO: use id for private button instead of class
    cy.get('#modal-container').within(($myModal1) => {
      cy.get('.cy-visibility-private').click()
    })
    //save changes
    cy.get('#save-emails-button').click()
    //verify change
    cy.get('app-panel-privacy').should('have.attr', 'aria-label', 'PRIVATE')

    //sign out
    cy.get('app-user-menu').click()
    cy.get('#cdk-overlay-3').within(($menu) => {
      cy.get('.mat-menu-item').contains('Logout').click()
    })
  })
})
