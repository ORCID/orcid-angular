/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'
import testingData from '../../fixtures/negative-testing-data.fixture.json'

describe('App displays error messages when user inputs invalid data', async function () {

  before(() => {
    cy.visit(Cypress.env('signInURL'))
    //sign in
    cy.signin(userData.cyUserPrimaryEmaiVerified)
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
  })

  it('Title is not required', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#description-input').clear()//empty
    cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.duplicateURL)
    cy.get('#save-websites-button').click({force:true})

    //verify the URL becomes the link title displayed in my-orcid
    cy.get('#websites-panel')
      .within(($section) => {
        cy.get('[class="line"]')
      })
      .should('contain', testingData.sidebarWebsitesURL.duplicateURL)
  })  

  it('URL field is required', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
     cy.get('#add-link').click()
    cy.get('#description-input').clear().type(testingData.sidebarWebsitesURL.titleURL)
    cy.get('#url-input').clear()//empty
    //try to save
    cy.get('#save-websites-button').click()

    //verify the URL field is required
    cy.get('mat-error').should('have.text',testingData.errorMessages.requiredURL)
    cy.get('#cancel-websites-button').click()    
  })
    
  it('Boundary value analysis: URL max size allowed is 2000 characters', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#description-input').clear().type(testingData.sidebarWebsitesURL.titleURL)
    cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.maxSize2000)
    
    //save
    cy.get('#save-websites-button').click()
  
    //verify the title is displayed in my orcid
    cy.get('#websites-panel')
    .within(($section) => {
      cy.get('[class="line"]')
    })
    .should('contain', testingData.sidebarWebsitesURL.titleURL)
  })

  it('Boundary value analysis: Max size +1 (2001 characters) is invalid', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
      cy.get('#add-link').click()
    cy.get('#description-input').clear().type(testingData.sidebarWebsitesURL.titleURL)
    //type a valid url longer than 2000 characters
    cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.maxSize2000+'/test')
    //try to save
    cy.get('#save-websites-button').click()

    //verify the link field was not added
    cy.get('#websites-panel')
    .within(($section) => {
      cy.get('[class="line"]').should('not.exist')
    })
  })

  it('Duplicate URLs are not allowed', function () {
    //The duplicate detection is case insensitive and irrelevant of which protocol is used
    //click edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    //add valid title and url
    cy.get('#add-link').click()
    cy.get('#description-input').clear().type(testingData.sidebarWebsitesURL.titleURL)
    cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.duplicateURL)
    cy.get('#save-websites-button').click()
    
   //reload page to reflect changes
    cy.reload()

    //click edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel1) => {
      cy.get('#edit-button').click()
    })
    //try to add same url with all caps
    cy.get('#add-link').click()
    cy.get('#draggable-1').within(($row1) => {
       cy.get('#description-input').clear().type(testingData.sidebarWebsitesURL.duplicateTitle)
      cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.duplicateAllCapsURL)
    })
    cy.get('#save-websites-button').trigger("click")

    //verify error message is displayed
    cy.get('mat-error').should('have.text',testingData.errorMessages.duplicatedURL)
  
    cy.get('#cancel-websites-button').click()
  })

  it('Automatically prefix protocol if not provided by user', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.noProtocolURL)
    cy.get('#save-websites-button').click()

    //verify http is prefxed automatically
    cy.get('#websites-panel')
    .within(($section) => {
      cy.get('[class="line"]')
    })
    .should('contain', testingData.sidebarWebsitesURL.appendixedProtocolURL)
  })

  it('URLs in mixedcase are valid', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.mixedCaseURL)
    cy.get('#save-websites-button').click()

    //verify URL case was not modified by the system in any way
    cy.get('#websites-panel')
    .within(($section) => {
      cy.get('[class="line"]')
    })
    .should('contain', testingData.sidebarWebsitesURL.mixedCaseURL)
  })

  it('Internationalized (valid) URLs are not allowed', function () {
    /* Business rule: valid internationalized URLs are NOT supported */
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#description-input').clear().type(testingData.sidebarWebsitesURL.titleURL)
    cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.internationalURL1)
    cy.get('#save-websites-button').click()
   //verify error message is displayed
    cy.get('mat-error').should('have.text',testingData.errorMessages.invalidURL)
  
    cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.internationalURL2)
    cy.get('#save-websites-button').click()
    //verify error message is displayed
    cy.get('mat-error').should('have.text',testingData.errorMessages.invalidURL)
 
    cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.internationalURL3)
    cy.get('#save-websites-button').click()
    //verify error message is displayed
    cy.get('mat-error').should('have.text',testingData.errorMessages.invalidURL)
 
    cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.internationalURL4)
    cy.get('#save-websites-button').click()
    //verify error message is displayed
    cy.get('mat-error').should('have.text',testingData.errorMessages.invalidURL)

    cy.get('#cancel-websites-button').click()

  })

  it('Error messages display according to the language selected', function () {
    //switch to Spanish
    cy.get('[aria-label="language"]').click()
    cy.get('[id^=cdk-overlay]').within(($menuLanguage) => {
      cy.get('button[role="menuitem"]').contains(testingData.errorMessages.displayLanguageSpanish).click()
    })
    cy.get('[lang="es"]')//wait for language to refresh
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#description-input').clear().type(testingData.sidebarWebsitesURL.titleURL)
    cy.get('#url-input').clear()//empty
    cy.get('#save-websites-button').click()

    //verify the URL field is required
    cy.get('mat-error').should('have.text',testingData.errorMessages.requiredURLSpanish)

    cy.get('#cancel-websites-button').click()

    //switch back to English
    cy.get('[aria-label="idioma"]').click()
    cy.get('[id^=cdk-overlay]').within(($menuLanguage1) => {
      cy.get('button[role="menuitem"]').contains(testingData.errorMessages.displayLanguageEnglish).click()
    })
    cy.get('[lang="en"]')//wait for language to refresh before Log out
  })

  it('Leading whitespace in URL are invalid',function(){
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#description-input').clear().type(testingData.sidebarWebsitesURL.titleURL)
    cy.get('#url-input').clear().type('   '+testingData.sidebarWebsitesURL.duplicateURL)
    //try to save
    cy.get('#save-websites-button').click()

    //verify the URL field is required
    cy.get('mat-error').should('have.text',testingData.errorMessages.invalidURL)

    cy.get('#cancel-websites-button').click()
  })

  it('Trailing whitespace in URL are invalid',function(){
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#description-input').clear().type(testingData.sidebarWebsitesURL.titleURL)
    cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.duplicateURL+'     ')
    //try to save
    cy.get('#save-websites-button').click()
  
    //verify the URL field is required
    cy.get('mat-error').should('have.text',testingData.errorMessages.invalidURL)
  
    cy.get('#cancel-websites-button').click()
  })

  it('Duplicates added via API show error message', function () {
  //  if a user creates a URL and then an API client posts the same URL,
  //  or two different API clients add the same URL, 
  //  the user will see the URLs marked as duplicates when they open the section

    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#description-input').clear().type(testingData.sidebarWebsitesURL.titleURL)
    cy.get('#url-input').clear().type(testingData.sidebarWebsitesURL.duplicateURL)
    cy.get('#save-websites-button').click()

    //add same URL via API
    //const jsonFilePath=userData.cyUserMemmerAPI.curlPostWebsitePath
    const endpoint=Cypress.env('membersAPI-URL')+userData.cyUserPrimaryEmaiVerified.oid+Cypress.env('membersAPI-websitesEndPoint')
    const curlStatement="curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer "+
    userData.cyUserMemmerAPI.bearer +"' -d '"+ userData.cyUserMemmerAPI.curlPostWebsitePath +"' -X POST '"+ endpoint +"'"
    
    cy.log(curlStatement)    
    cy.exec(curlStatement).then(response => {
      expect(response.code).to.eq(0)
    })

    //reload page to reflect changes
    cy.reload()
  
    //verify both entries are displayed with error message
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('mat-error').eq(0).should('have.text',testingData.errorMessages.duplicatedURL)
    cy.get('mat-error').eq(1).should('have.text',testingData.errorMessages.duplicatedURL)

    cy.get('#cancel-websites-button').click()

  })

  afterEach(() => {
    //clean up state
    cy.cleanWebsites()

    //reload page to reflect clean up
    cy.reload()
  })

  after(() => {  
    //sign out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({force:true})
  })

})
