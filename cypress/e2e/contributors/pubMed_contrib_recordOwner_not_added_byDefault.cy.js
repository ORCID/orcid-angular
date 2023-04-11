/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Record holder not added as default contributor to works imported from PubMed', async function () {
  const pubMediaUrl = 'https://pubmed.ncbi.nlm.nih.gov/'
  const extId = userData.cyRecordOwner.pubMed_qase78_extId
  const contribName = userData.cyRecordOwner.pubMed_qase78_contrib

  before(() => {
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
  })

  qase(
    '78',
    it('Record holder not added as default contributor to works imported from PubMed', function () {
      cy.get('#cy-works').within(($myPanel) => {
        cy.get('#cy-menu-add-works').click()
      })
      cy.get('#cy-add-work-pubmed').click({ force: true })
      cy.get('#external-id-input')
        .clear()
        .type(pubMediaUrl + extId)
      cy.get('[id^="cy-retrieve-work-details"]').click()
      cy.wait(4000) //waiting for backend

      //verify contributors loaded
      cy.contains('.credit-name-and-roles', contribName).should('exist')
      cy.get('#save-work-button').click()
      cy.wait(4000) //waiting for backend

      //Verify work was added with contrib in summary
      cy.get('app-work-stack').should('contain', contribName)

      //Summary view - record owner not added
      cy.contains('app-panel-data', contribName).within(($thisWork) => {
        cy.contains('Contributors')
          .parent()
          .should('not.contain', userData.cyRecordOwner.name)
        cy.contains('Show more detail').click()
      })
      //Details section - - record owner not added
      cy.contains('app-display-attribute', 'Contributors').should(
        'not.contain',
        userData.cyRecordOwner.name
      )
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
