/// <reference types="cypress" />

import testData from '../../fixtures/affiliations-testing-data.fixture.json'

describe('My orcid - users are able to edit work info in their record', async function () {
  before(() => {
    cy.programmaticallySignin('cyUserPrimaryEmaiVerified')//send user key from fixture file
    cy.visit('/my-orcid')
    cy.get('#cy-works')//wait for page to load
  })

  it('User adds work by DOI and without modifying manually', function () {
    const testWorks=testData.affilliantionWorks

    cy.get('#cy-works').within(($myPanel) => {
      cy.get('#cy-menu-add-works').click() 
    })
    cy.get('#cy-add-work-doi').click({force:true})
    cy.get('#external-id-input').clear().type(testWorks.DOI)
    cy.get(`[id^='cy-retrieve-work-details']`).click()
    cy.get('#save-work-button').should('be.visible')//wait for modal to display
    cy.get('#save-work-button').click()
    //Verify work was added
    cy.get('#cy-works').should('contain',testWorks.workTitleDOI)
  })

  after(()=>{
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({force:true})
  })
})




