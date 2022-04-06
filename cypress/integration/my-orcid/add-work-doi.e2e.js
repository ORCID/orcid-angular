/// <reference types="cypress" />

import testData from '../../fixtures/affiliations-testing-data.fixture.json'

describe('My orcid - users are able to edit work info in their record', async function () {
  before(() => {
    cy.programmaticallySignin('cyUserPrimaryEmaiVerified')//send user key from fixture file
    cy.visit(Cypress.env('baseUrl')+`/my-orcid`)
    cy.get('app-side-bar')//wait for page to load
  })

  it('User adds work by DOI and without modifying manually', function () {
    cy.get('app-work-stack-group').within(($myPanel) => {
      cy.get('button[aria-label="Add Work"]').click() //TO DO: replace once element id is added
    })
    cy.contains(' Add DOI ').click({force:true})//REPLACE with element id
    cy.get('#external-id-input').clear().type(testData.affilliantionWorks.DOI)
    cy.contains('Retrieve work details from DOI').click()//REPLACE with element id
    cy.get('#save-work-button').should('be.visible')//wait for modal to display
    cy.get('#save-work-button').click()
    //Verify work was added
    cy.get('app-work-stack').within(($myPanel) => {
      expect($myPanel).to.contain(testData.affilliantionWorks.workTitleDOI)
    })
  })
 
  after(()=>{
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({force:true})
  })
})
