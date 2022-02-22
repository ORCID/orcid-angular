/// <reference types="cypress" />

import userData from '../../fixtures/testing_users.json'

describe('My orcid - users are able to add content to their record', async function () {
  before(() => {
    cy.visit(Cypress.env('signInURL'))
    //sign in
    cy.signin(userData.cyUser_primaryEmaiVerified)
    cy.wait(1000)
  })

  it('User adds a country to their record', function () {
    const countrySelected = 'Albania'

    cy.get('#countries-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()

    // simulate click event on the drop down
    cy.get('mat-select').first().click() // opens the drop down
    // simulate click event on the drop down item (mat-option)
    cy.get('.mat-option-text')
      .contains(countrySelected)
      .then((option) => {
        option[0].click() // this is jquery click() not cypress click()
      })

    cy.get('#save-countries-button').click()
    cy.wait(3000)

    //verify the country is displayed
    cy.get('#countries-panel')
      .within(($section) => {
        cy.get('[class="line"]')
      })
      .should('contain', countrySelected)

    //clean up state
    cy.cleanCountries()

    //sign out
    cy.get('app-user-menu').click()
    cy.get('#cdk-overlay-3').within(($menu) => {
      cy.get('.mat-menu-item').contains('Logout').click()
    })
  })
})
