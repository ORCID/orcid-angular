/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'
import testingData from '../../fixtures/negative-testing-data.fixture.json'

describe('My orcid - users are able to add content to their record', async function () {
  before(() => {
    cy.visit(Cypress.env('signInURL'))
    //sign in
    cy.signin(userData.cyUserPrimaryEmaiVerified)
    cy.wait(1000)
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
  })

  it('User adds a website to their record', function () {
    const addDesc = 'Testing new website'
    const addUrl = 'https://www.nationalgeographic.com/'

    //click on edit pencil for Emails section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })

    cy.get('#add-link').click()

    cy.get('#description-input').clear().type(addDesc)
    cy.get('#url-input').clear().type(addUrl)
    cy.get('#save-websites-button').click()
    cy.wait(1000)

    //verify the keyword is displayed
    cy.get('#websites-panel')
      .within(($section) => {
        cy.get('[class="line"]')
      })
      .should('contain', addDesc)
  })

  it('Arabic characters in URL title field are allowed', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#description-input')
      .clear()
      .type(testingData.sidebarWebsitesURL.arabicTitle)
    cy.get('#url-input')
      .clear()
      .type(testingData.sidebarWebsitesURL.duplicateURL)
    //try to save
    cy.get('#save-websites-button').click()

    //verify the title is displayed correctly
    cy.get('#websites-panel')
      .within(($section) => {
        cy.get('[class="line"]')
      })
      .should('contain', testingData.sidebarWebsitesURL.arabicTitle)
  })

  it('Russian characters in URL title field are allowed', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#description-input')
      .clear()
      .type(testingData.sidebarWebsitesURL.russianTitle)
    cy.get('#url-input')
      .clear()
      .type(testingData.sidebarWebsitesURL.duplicateURL)
    //try to save
    cy.get('#save-websites-button').click()

    //verify the title is displayed correctly
    cy.get('#websites-panel')
      .within(($section) => {
        cy.get('[class="line"]')
      })
      .should('contain', testingData.sidebarWebsitesURL.russianTitle)
  })

  it('Chinese characters in URL title field are allowed', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#description-input')
      .clear()
      .type(testingData.sidebarWebsitesURL.chineseTitle)
    cy.get('#url-input')
      .clear()
      .type(testingData.sidebarWebsitesURL.duplicateURL)
    //try to save
    cy.get('#save-websites-button').click()

    //verify the title is displayed correctly
    cy.get('#websites-panel')
      .within(($section) => {
        cy.get('[class="line"]')
      })
      .should('contain', testingData.sidebarWebsitesURL.chineseTitle)
  })



  it('Leading whitespace in URL are trimmed on save', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#description-input')
      .clear()
      .type(testingData.sidebarWebsitesURL.titleURL)
    cy.get('#url-input')
      .clear()
      .type('   ' + testingData.sidebarWebsitesURL.duplicateURL)
    //try to save
    cy.get('#save-websites-button').click()

    //verify the URL field is required
    cy.get('mat-error').should(
      'have.text',
      testingData.errorMessages.invalidURL
    )

    //verify the title is displayed correctly
    cy.get('#websites-panel')
      .within(($section) => {
        cy.get('[class="line"]')
      })
      .should('contain', testingData.sidebarWebsitesURL.titleURL)
  })


  it('Trailing whitespace in URL are trimmed on save', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('#edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('#description-input')
      .clear()
      .type(testingData.sidebarWebsitesURL.titleURL)
    cy.get('#url-input')
      .clear()
      .type(testingData.sidebarWebsitesURL.duplicateURL + '     ')
    //try to save
    cy.get('#save-websites-button').click()

    //verify the URL field is required
    cy.get('mat-error').should(
      'have.text',
      testingData.errorMessages.invalidURL
    )
    
    //verify the title is displayed correctly
    cy.get('#websites-panel')
      .within(($section) => {
        cy.get('[class="line"]')
      })
      .should('contain', testingData.sidebarWebsitesURL.titleURL)  })

  afterEach(() => {
    //clean up state
    cy.cleanWebsites()

    //reload page to reflect clean up
    cy.reload()
  })

  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
