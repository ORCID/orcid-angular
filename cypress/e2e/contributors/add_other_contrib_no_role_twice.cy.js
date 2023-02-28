/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Other ppl contributions - add contributor with no specific credit role twice', async function () {
  before(() => {
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
    cy.wait(2000)
  })

  qase(
    '33',
    it('Add other contributor with no specific credit role twice', function () {
      const workType = 'Book'
      const title = 'Cypress test contributors 33'
      const otherContributorName = 'MacGyver'

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
        //click to add another role but leave default value
        cy.get('.cy-add-another-role').click()
      })

      //save entry
      cy.get('#save-work-button').wait(1000).click({ force: true })
      cy.wait(2000)

      //Verify work was added even when role was not selected
      cy.contains('app-work-stack', otherContributorName).within(
        ($thisWork) => {
          //open edit form
          cy.get('button[aria-label*="Edit"]').click()
        }
      )
      cy.wait(2000)
      //verify the contributor is displayed in the contributors section
      cy.get('app-work-contributors')
        .should('contain.text', otherContributorName)
        //verify default role txt is NOT displayed
        .and('not.contain.text', 'No Specified Role')
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
