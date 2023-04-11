/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Add other contributor with duplicate roles - negative testing', async function () {
  before(() => {
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
  })

  qase(
    '32',
    it('Add other contributor with duplicate roles - negative testing', function () {
      const workType = 'Book'
      const title = 'Cypress test contributors 32'
      const otherContributorName = 'Bryan Adams'
      const creditRole = 'Conceptualization'
      const fieldErrorMessage = 'Role cannot be duplicated'
      const formErrorPopUp = 'Form validation error'

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
      cy.get('.cy-add-another-contributor').click()
      cy.get('app-work-contributors').within(($section) => {
        cy.get('[formcontrolname="creditName"]')
          .clear()
          .type(otherContributorName)
        cy.get('[formcontrolname="role"]').click({ force: true })
      })
      //choose credit role
      cy.get('[role="listbox"]').within(($list) => {
        cy.contains(creditRole).click()
        cy.wait(1000)
      })
      cy.get('app-work-contributors').within(($section) => {
        cy.get('.cy-add-another-role').click()
        cy.get('[formcontrolname="role"]')
          .contains('No Specified Role')
          .click({ force: true })
        cy.wait(2000)
      })
      //choose credit role
      cy.get('[role="listbox"]').within(($list) => {
        cy.contains(creditRole).click()
        cy.wait(1000)
      })
      //form validation is displayed
      cy.get('mat-error')
        .contains(fieldErrorMessage, { matchCase: false })
        .should('be.visible')

      //try to save entry
      cy.get('#save-work-button').wait(1000).click({ force: true })
      cy.wait(1000)
      cy.get('snack-bar-container')
        .contains(formErrorPopUp, { matchCase: false })
        .should('be.visible')

      //remove duplicate role
      cy.get('app-work-contributors').within(($section) => {
        cy.get('[id*="cy-remove-role"]').click()
      })

      //save entry
      cy.get('#save-work-button').wait(1000).click({ force: true })

      //Verify work was added
      cy.contains('app-panel-data', otherContributorName).within(
        ($thisWork) => {
          cy.contains('Show more detail').click()
        }
      )
      //verify contributor is displayed in details section for this work
      cy.get('app-display-attribute')
        .contains(otherContributorName)
        .contains(creditRole, { matchCase: false })
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
