/// <reference types="cypress" />

import testData from '../../fixtures/affiliations-testing-data.fixture.json'

describe('My orcid - users are able to edit work info in their record', async function () {
  before(() => {
    cy.programmaticallySignin('cyUserPrimaryEmaiVerified')//send user key from fixture file
    cy.visit(Cypress.env('baseUrl')+`/my-orcid`)
    cy.get('app-work-stack-group')//wait for page to load
  })

  it('User adds work manually', function () {
    const testWorks=testData.affilliantionWorks

    cy.get('app-work-stack-group').within(($myPanel) => {
      cy.get('button[aria-label="Add Work"]').click() //TO DO: replace once element id is added
    })
    cy.contains(' Add manually ').click({force:true})//REPLACE with element id
    //set type and title
    cy.get('[placeholder="Select a work type"]').click() //REPLACE with element id
    cy.get('[role="listbox"]').within(($myPanel) => {//REPLACE with element id
      cy.contains(testWorks.manuallyType).click()
    })
    cy.get('#title-input').clear().type(testWorks.manuallyTitle)
    //add translated title
    cy.contains('Add translated title').click()
    cy.get('#biography-input').clear().type(testWorks.manuallyTranslatedTitle)//REPLACE id
    cy.get('#language-of-title-input').click()
    cy.get('#language-of-title-input-panel').within(($myPanel) => {
      cy.contains(testWorks.manuallyLanguage).click()
    })
    //add publication details
    cy.get('#work-subtitle-input').clear().type(testWorks.manuallySubtitle)
    cy.get('[formcontrolname="journalTitle"]').clear().type(testWorks.manuallyJournalTitle)//REPLACE id
    cy.get('[formcontrolname="publicationYear"]').click()//replace with id for the element when we add it 
    cy.get('[role="listbox"]').within(($list) => { //replace with id for the element when we add it 
      cy.contains(testWorks.manuallyYear).click()
    })
    cy.get('[formcontrolname="publicationMonth"]').click()//replace with id for the element when we add it 
    cy.get('[role="listbox"]').within(($list) => { //replace with id for the element when we add it 
      cy.contains(testWorks.manuallyMonth).click()
    })
    cy.get('[formcontrolname="publicationDay"]').click()//replace with id for the element when we add it 
    cy.get('[role="listbox"]').within(($list) => { //replace with id for the element when we add it 
      cy.contains(testWorks.manuallyDay).click()
    })
    cy.get('#url-input').clear().type(testWorks.manuallyLink)
    //add citation
    cy.get('[formcontrolname="citationType"]').click()//REPLACE with id
    cy.get('[role="listbox"]').within(($list) => { //replace with id for the element when we add it 
      cy.contains(testWorks.manuallyCitationType).click()
    })
    cy.get('#citation-input').clear().type(testWorks.manuallyCitation)
    cy.get('#description-input').clear().type(testWorks.manuallyCitationDesc)
    //add identifier
    cy.get('[formcontrolname="externalIdentifierType"]').click()////REPLACE with id
    cy.get('[role="listbox"]').within(($list) => { //replace with id for the element when we add it 
      cy.contains(testWorks.manuallyIdentifierType).click()
    })
   cy.get('#external-identifier-id-input').clear().type(testWorks.manuallyIdentifierId)
   cy.get('#external-identifier-url-input').clear().type(testWorks.manuallyIdentifierLink)
   cy.get('#external-relationship-input').within((radioButtons)=>{
     cy.contains(testWorks.manuallyRelationship).select()
   })
   cy.get('#language-input').click()
   cy.contains(testWorks.manuallyFormLanguage).click()
   cy.get('#country-input').click()
   cy.get('#country-input-panel').within((list)=>{
    cy.contains(testWorks.manuallyFormCountry).click()
   })
   //by default visibility is set to public, change it in case test data indicates limited/private
   if(testWorks.manuallyVisibility == 'limited'){
     cy.get('[aria-label="visibility limited"]').click() //REPLACE with id
   }else{
    if(testWorks.manuallyVisibility == 'private'){
      cy.get('[aria-label="visibility private"]').click()//REPLACE with id
    } 
  }
   cy.get('#save-work-button').click()
   
   //Verify work was added
   cy.get('app-work-stack').within(($myPanel) => {
    expect($myPanel).to.contain(testWorks.manuallyTitle)
  })
})
 
 
  after(()=>{
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({force:true})
  })
})
