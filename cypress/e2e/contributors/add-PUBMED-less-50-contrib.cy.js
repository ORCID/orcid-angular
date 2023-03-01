/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Add PUBMED ID with less than 50 contributors', async function () {
  const pubmedURL = 'https://pubmed.ncbi.nlm.nih.gov/'

  before(() => {
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
  })

  qase(
    '44',
    it('Add PUBMED ID with less than 50 contributors', function () {

      cy.get('#cy-works').within(($myPanel) => {
        cy.get('#cy-menu-add-works').click()
      })
      cy.get('#cy-add-work-pubmed').click({ force: true })
      cy.get('#external-id-input').clear().type(pubmedURL + userData.cyRecordOwner.pubmed_qase44 +'/')
      cy.get('[id^=cy-retrieve-work-details]').click()
      cy.wait(4000)//need to wait for back end
      
      //save entry
      cy.get('#save-work-button').click({ force: true })
      cy.wait(2000)
     
      //Verify work was added
      cy.get('app-work-stack').should('contain', userData.cyRecordOwner.pubmed_qase44)
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
