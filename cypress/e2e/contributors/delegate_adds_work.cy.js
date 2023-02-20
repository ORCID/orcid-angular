/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Account delegate adds work with contributors', async function () {
  before(() => {
    cy.intercept('POST', '/switch-user?**').as('switchUser')
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyDelegate)
    cy.wait(2000)
  })

  qase(
    '34',
    it('Account delegate adds work with contributors', function () {
      const workType = 'Book'
      const title = 'Cypress test contributors 34 - delegate'

      cy.contains('a', 'Switch to').click({ force: true })
      cy.contains(userData.cyRecordOwner.oid).click({ force: true })
      cy.wait('@switchUser')
      //work around for cypress to aknowledge we switched users
      cy.visit('/my-orcid')
      //verify we switched to record owner account
      cy.get('#status-bar').should('contain', userData.cyRecordOwner.oid)

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

      //Verify work was added for the record owner not the delegate
      cy.contains('app-work-stack', title).within(($thisWork) => {
        cy.contains('Show more detail').click()
        cy.get('app-display-attribute').should(
          'contain',
          userData.cyRecordOwner.name,
          {
            matchCase: false,
          }
        )
      })
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
