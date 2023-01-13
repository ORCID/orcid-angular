/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'

describe('My orcid - users are able to add content to their record', async function () {
  before(() => {
    cy.visit(Cypress.env('signInURL'))
    //sign in
    cy.signin(userData.cyUserPrimaryEmaiVerified)
    cy.wait(1000)
  })

  it('User adds a keywords to their record', function () {
    const addKeyword = 'Research'
    //click on edit pencil for Keywords section
    cy.get('#keywords-panel').within(($myPanel) => {
      cy.get('.cy-edit-button').click()
    })

    cy.get('#add-keyword').click()

    cy.get('.content-input').clear().type(addKeyword)
    cy.get('#save-keywords-button').click()
    cy.wait(1000)

    //verify the keyword is displayed
    cy.get('#keywords-panel')
      .within(($section) => {
        cy.get('[class="line"]')
      })
      .should('contain', addKeyword)

    //clean up state
    cy.cleanKeywords()

    //sign out
    cy.get('app-user-menu').click()
    cy.get('#cdk-overlay-2').within(($menu) => {
      cy.get('.mat-menu-item').contains('Logout').click()
    })
  })
})
