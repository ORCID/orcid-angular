/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Other ppl contributions - add contributor with credit role', async function () {
  before(() => {
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
  })

  qase(
    '3',
    it('Add other contributor with credit role to a work added manually', function () {
      const workType = 'Book'
      const title = 'Cypress test contributors'
      const otherContributorName = 'Michael Jordan'
      const creditRole = 'Investigation'

      cy.get('#cy-works').within(($myPanel) => {
        cy.get('#cy-menu-add-works').click()
      })
      cy.get('#cy-add-work-manually').click({ force: true })
      cy.get('#cy-work-types').click()
      cy.get('#cy-work-types-panel').within(($myOptions) => {
        cy.contains(workType).click()
      })
      cy.get('#title-input').clear().type(title)

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
        //to do REPLACE with id for the element next sprint
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
