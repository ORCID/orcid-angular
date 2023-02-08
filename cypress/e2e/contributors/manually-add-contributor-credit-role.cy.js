/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Manually add work with contributor credit role', async function () {
  before(() => {
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
  })

  //manually adding a simple work entry
  //choosing a contributor credit role for the record owner
  qase(
    '1',
    it('Manually add work with contributor credit role', function () {
      const workType = 'Book'
      const title = 'Cypress test contributors 1'
      const creditRole = 'Conceptualization'

      cy.get('#cy-works').within(($myPanel) => {
        cy.get('#cy-menu-add-works').click()
      })
      cy.get('#cy-add-work-manually').click({ force: true })
      cy.get('#cy-work-types').click()
      cy.get('#cy-work-types-panel').within(($myOptions) => {
        cy.contains(workType).click()
      })
      cy.get('#title-input').clear().type(title)
      cy.get('[formcontrolname="role"]').click() //TO DO: replace locators with ids
      cy.get('[role="listbox"][aria-label="Please select a role"]').within(
        ($myOptions) => {
          cy.contains(creditRole).click()
        }
      )
      //save entry
      cy.get('#save-work-button').wait(1000).click({ force: true })
      cy.wait(1000) //wait for the page to refresh
      //Verify work was added
      cy.get('#cy-works', { timeout: 10000 }).should('contain', title)

      //verify contributors info is displayed
      cy.get('#cy-works').should('contain', creditRole)
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
