/// <reference types="cypress" />

describe('Account Settings - users can change default visibility setting for data added to their record', async function () {
  beforeEach(() => {
    cy.programmaticallySignin('cyAcctSettVisibilityUser') //send user key from fixture file
    cy.visit('/my-orcid')
    cy.get('#biography-panel') //wait for page to load
  })

  it('Verify default visibility is "Everyone" when user has this setting', function () {
   //check Account Settings> visibility has "Everyone" selected
   cy.get('#cy-user-info').click()
   cy.get('#cy-account-settings').click()
   cy.get('#cy-visibility-panel-action-more').click()
   cy.get('#cy-visibility-everyone-input').click()
   //try to add new affiliation, visibility "Everyone" is selected
   cy.get('#cy-user-info').click()
   cy.get('#cy-my-orcid').click()
   cy.get('#cy-add-btn-employment').click()
   cy.get('app-modal').within(()=>{
    cy.get('#cy-visibility-public').should('have.class', 'selected');
    cy.get('#cancel-affiliation-button').click()
   })
  })

  it('Verify default visibility is "Trusted Organizations" when user has this setting', function () {
    //check Account Settings> visibility has "Trusted Organizations" selected
    cy.get('#cy-user-info').click()
    cy.get('#cy-account-settings').click()
    cy.get('#cy-visibility-panel-action-more').click()
    cy.get('#cy-visibility-trusted-input').click()
    //try to add new affiliation, visibility "Trusted Organizations" is selected
    cy.get('#cy-user-info').click()
    cy.get('#cy-my-orcid').click()
    cy.get('#cy-add-btn-employment').click()
    cy.get('app-modal').within(()=>{
     cy.get('#cy-visibility-limited').should('have.class', 'selected');
     cy.get('#cancel-affiliation-button').click()
    })
   })

   it('Verify default visibility is "Only me" when user has this setting', function () {
    //check Account Settings> visibility has "Only me" selected
    cy.get('#cy-user-info').click()
    cy.get('#cy-account-settings').click()
    cy.get('#cy-visibility-panel-action-more').click()
    cy.get('#cy-visibility-private-input').click()
    //try to add new affiliation, visibility "Only me" is selected
    cy.get('#cy-user-info').click()
    cy.get('#cy-my-orcid').click()
    cy.get('#cy-add-btn-employment').click()
    cy.get('app-modal').within(()=>{
     cy.get('#cy-visibility-private').should('have.class', 'selected');
     cy.get('#cancel-affiliation-button').click()
    })
   })
  
  afterEach(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})