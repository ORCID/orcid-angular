/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Add DOI with more than 50 contributors WITH roles AND sequences', async function () {
  const noticeMessage = 'This work has a large number of contributors'

  before(() => {
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
  })

  qase(
    '43',
    it('Add DOI with more than 50 contributors WITH roles AND sequences', function () {
      cy.get('#cy-works').within(($myPanel) => {
        cy.get('#cy-menu-add-works').click()
      })
      cy.get('#cy-add-work-doi').click({ force: true })
      cy.get('#external-id-input')
        .clear()
        .type(userData.cyRecordOwner.doi_qase43)
      cy.get('[id^=cy-retrieve-work-details]').click()
      cy.wait(4000) //need to wait for back end

      //verify link to add one more contrib is not displayed
      cy.contains('Add another contributor').should('not.exist')

      //verify the panel is displayed
      cy.contains('.notice-panel', noticeMessage).should('exist')

      //save entry
      cy.get('#save-work-button').click({ force: true })
      cy.wait(2000)

      //Verify work was added
      cy.get('app-work-stack').contains(userData.cyRecordOwner.doi_qase43, {
        matchCase: false,
      })
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
