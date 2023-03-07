/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Add self as contributor to work added from PubMed ID', async function () {
  const pubMediaUrl= "https://pubmed.ncbi.nlm.nih.gov/"
  const extId= userData.cyRecordOwner.pubMed_qase86_extId

  before(() => {
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
  })

  qase(
    '86',
    it('Add self as contributor to work added from PubMed ID', function () {

      cy.get('#cy-works').within(($myPanel) => {
        cy.get('#cy-menu-add-works').click()
      })
      cy.get('#cy-add-work-pubmed').click({ force: true })
      cy.get('#external-id-input').clear().type(pubMediaUrl + extId)
      cy.get('[id^="cy-retrieve-work-details"]').click()
      cy.wait(2000)

      //add self as contributor
      cy.get('#cy-add-record-holder-contributor').click()
      cy.wait(2000)
      //verify contributors loaded
      cy.contains('.credit-name-and-roles', userData.cyRecordOwner.name).should('exist')

      cy.get('#save-work-button').click({force:true})
      cy.wait(4000)//waiting for backend
     
    //Summary view - record owner not added
     cy.contains('app-panel-data', extId).within(
      ($thisWork) => {
        cy.contains('Contributors').parent().should('include.text', userData.cyRecordOwner.name)
        cy.contains('Show more detail').click()
      }
    )  
    //Details section - - record owner not added
    cy.contains('app-display-attribute','Contributors').should('include.text', userData.cyRecordOwner.name)
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
