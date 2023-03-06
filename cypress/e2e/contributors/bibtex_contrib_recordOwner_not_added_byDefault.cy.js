/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Add work using BibTeX citation where contributor list ends with "and"', async function () {
    const bibtextFilePath = userData.cyRecordOwner.bibtex_qase76_path
    const contribName = userData.cyRecordOwner.bibtex_qase76_contrib

  before(() => {
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
  })

  qase(
    '76',
    it('Add work using BibTeX citation where contributor list ends with "and"', function () {

      cy.get('#cy-works').within(($myPanel) => {
        cy.get('#cy-menu-add-works').click()
      })
      cy.get('#cy-add-work-bibtext').click({ force: true })
      //use CYPRESS-UPLOAD-FILE package to bypass OS file picker modal
      cy.get('[type="file"]').attachFile(bibtextFilePath)
      cy.wait(2000)//need to wait for back end
      
      //select work
      cy.get('[formcontrolname="checked"]').click()
      cy.get('#cy-import-works').click()
      cy.wait(2000) //load data
     
      //Verify work was added with contrib in summary
      cy.get('app-work-stack').should('contain', contribName)
     
     //Summary view - record owner not added
     cy.contains('app-panel-data', contribName).within(
      ($thisWork) => {
        cy.contains('Contributors').parent().should('not.contain',userData.cyRecordOwner.name)
        cy.contains('Show more detail').click()
      }
    )  
    //Details section - - record owner not added
    cy.contains('app-display-attribute','Contributors').should('not.contain',userData.cyRecordOwner.name)
    })

  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
