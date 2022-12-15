/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'

describe('My orcid - users are able to add content to their record', async function () {
  before(() => {
    cy.visit(Cypress.env('signInURL'))
  })

  it('User adds a published name', function () {
    const addPublishedName = 'QA Published Name'
    //sign in
    cy.signin(userData.cyUserPrimaryEmaiVerified)
    cy.get('#names-panel').within(($namePanel) => {
      cy.get('.cy-edit-button').click()
    })
    //clear and type new input
    cy.get('#published-names-input').wait(1000).clear().type(addPublishedName)
    cy.get('#save-names-button').click()

    //verify the name is displayed
    cy.get('#publishedName').then(($content) => {
      let textFound = $content.text()
      cy.log(textFound)
      textFound = textFound.trim()
      cy.log(textFound)
      expect(textFound).equal(addPublishedName)
    })

    //sign out
    cy.get('app-user-menu').click()
    cy.get('#cdk-overlay-2').within(($menu) => {
      cy.get('.mat-menu-item').contains('Logout').click()
    })
  })
})
