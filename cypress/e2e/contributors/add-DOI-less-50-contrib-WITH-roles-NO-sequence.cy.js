/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Add DOI with less than 50 contributors WITH roles NO sequences', async function () {
  before(() => {
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
  })

  qase(
    '42',
    it('Add DOI with less than 50 contributors WITH roles NO sequences', function () {
      const workType = 'Book'

      cy.get('#cy-works').within(($myPanel) => {
        cy.get('#cy-menu-add-works').click()
      })
      cy.get('#cy-add-work-doi').click({ force: true })
      cy.get('#external-id-input')
        .clear()
        .type(userData.cyRecordOwner.doi_qase42)
      //retrieve data
      cy.get('[id^=cy-retrieve-work-details]').click()
      cy.wait(4000)

      //save entry
      cy.get('#save-work-button').click({ force: true })
      cy.wait(2000)
      //Verify work was added
      cy.get('app-work-stack').should(
        'contain',
        userData.cyRecordOwner.doi_qase42
      )
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
