/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Delete contributor while editing a work', async function () {
  const workType = 'Book'
  const title = 'Cypress test contributors 9'

  before(() => {
    //add a work manually
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
    cy.get('#cy-works').within(($myPanel) => {
      cy.get('#cy-menu-add-works').click()
    })
    cy.get('#cy-add-work-manually').click({ force: true })
    cy.get('#cy-work-types').click()
    cy.get('#cy-work-types-panel').within(($myOptions) => {
      cy.contains(workType).click()
    })
    cy.get('#title-input').clear().type(title)
    //save entry
    cy.get('#save-work-button').wait(1000).click({ force: true })
    cy.wait(2000)
  })

  qase(
    '9',
    it('Delete contributor while editing a work', function () {
      //edit work added
      cy.contains('app-work-stack', title).within(($thisWork) => {
        cy.get('button[aria-label*="Edit work"]').click()
      })

      //remove the record owner as contributor
      cy.get('app-work-contributors').within(($contribSection) => {
        cy.get('#cy-delete-button-0').click()
      })

      //save entry
      cy.get('#save-work-button').wait(1000).click({ force: true })
      cy.wait(2000)

      //Verify work was edited
      cy.contains('app-work-stack', title).within(($thisWork) => {
        cy.contains('Show more detail').click()
        cy.get('app-panel-data').should('not.include.text', 'Contributors', {
          matchCase: false,
        })
      })
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
