/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'

describe('My orcid - users are able to add content to their record', async function () {
  beforeEach(() => {
    cy.visit(Cypress.env('signInURL'))
  })

  it('User adds a biography content', function () {
    const addBio = 'This is my new Bio.'
    //sign in
    cy.signin(userData.cyUserPrimaryEmaiVerified) //send user key from fixture file
    cy.get('#biography-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#biography-input').clear().type(addBio)
    cy.get('#save-biography-button').click()

    //verify the name is displayed
    cy.get('#biography').then(($content) => {
      let textFound = $content.text()
      cy.log(textFound)
      textFound = textFound.trim()
      cy.log(textFound)
      expect(textFound).equal(addBio)
    })
    //clean up state
    cy.cleanBiography()

    //sign out
    cy.get('app-user-menu').click()
    cy.get('#cdk-overlay-2').within(($menu) => {
      cy.get('.mat-menu-item').contains('Logout').click()
    })
  })
})
