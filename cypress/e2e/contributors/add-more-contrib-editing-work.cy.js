/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Add other contributor while editing work', async function () {
  const workType = 'Book'
  const title = 'Cypress test contributors 8'
  const otherContributorName = 'Keanu Reeves'
  const creditRole = 'Investigation'

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
    '8',
    it('Add other contributor while editing work', function () {
      //edit work added
      cy.contains('app-work-stack', title).within(($thisWork) => {
        cy.get('button[aria-label*="Edit work"]').click()
      })
      //add someone else as contributor with credit role
      cy.get('#cy-add-another-contributor').click()
      cy.get('app-work-contributors').within(($section) => {
        cy.get('[formcontrolname="creditName"]')
          .clear()
          .type(otherContributorName)
        cy.get('[formcontrolname="role"]').click({ force: true })
      })
      //choose credit role
      cy.get('[role="listbox"]').within(($list) => {
        cy.contains(creditRole).click()
      })

      //save entry
      cy.get('#save-work-button').wait(1000).click({ force: true })
      cy.wait(2000)

      //Verify work was added
      cy.contains('app-panel-data', otherContributorName).within(
        ($thisWork) => {
          cy.contains('Show more detail').click()
        }
      )

      //verify contributor is displayed in details section for this work
      cy.get('app-display-attribute').contains(otherContributorName)
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
