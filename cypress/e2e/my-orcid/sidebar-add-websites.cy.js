/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'
import testingData from '../../fixtures/negative-testing-data.fixture.json'

describe('My orcid - users are able to add content to their record', async function () {
  //caching user session for each test
  const login = (user) => {
    cy.session(user.oid, () => {
      cy.visit(Cypress.env('signInURL'))
      cy.signin(user)
      cy.url().should('contain', '/my-orcid')
    })
    cy.visit('/my-orcid?orcid=' + user.oid)
  }

  beforeEach(() => {
    login(userData.cyUserPrimaryEmaiVerified)
  })

  it('User adds a website to their record', function () {
    const addDesc = 'Testing new website'
    const addUrl = 'https://www.nationalgeographic.com/'

    //click on edit pencil for Emails section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('.cy-edit-button').click()
    })

    cy.get('#add-link').click()

    cy.get('[formcontrolname="description"]').clear().type(addDesc)
    cy.get('[formcontrolname="url"]').clear().type(addUrl)
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
      cy.get('.cy-edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('[formcontrolname="description"]')
      .clear()
      .type(testingData.sidebarWebsitesURL.arabicTitle)
    cy.get('[formcontrolname="url"]')
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
      cy.get('.cy-edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('[formcontrolname="description"]')
      .clear()
      .type(testingData.sidebarWebsitesURL.russianTitle)
    cy.get('[formcontrolname="url"]')
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
      cy.get('.cy-edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('[formcontrolname="description"]')
      .clear()
      .type(testingData.sidebarWebsitesURL.chineseTitle)
    cy.get('[formcontrolname="url"]')
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

  it('Leading whitespaces in URL are trimmed on save', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('.cy-edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('[formcontrolname="description"]')
      .clear()
      .type(testingData.sidebarWebsitesURL.titleURL)
    cy.get('[formcontrolname="url"]')
      .clear()
      .type('   ' + testingData.sidebarWebsitesURL.duplicateURL)

    //app should let you save, no errors displayed
    cy.get('#save-websites-button').click()

    //verify the entry was added
    cy.get('#websites-panel')
      .within(($section) => {
        cy.get('[class="line"]')
      })
      .should('contain', testingData.sidebarWebsitesURL.titleURL)

    //verify url was trimmed
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('.cy-edit-button').click()
    })
    cy.get('[formcontrolname="url"]').should('not.contain', ' ')
  })

  it('Trailing whitespaces in URL are trimmed on save', function () {
    //click on edit pencil for websites section
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('.cy-edit-button').click()
    })
    cy.get('#add-link').click()
    cy.get('[formcontrolname="description"]')
      .clear()
      .type(testingData.sidebarWebsitesURL.titleURL)
    cy.get('[formcontrolname="url"]')
      .clear()
      .type(testingData.sidebarWebsitesURL.duplicateURL + '     ')

    //app should let you save, no errors displayed
    cy.get('#save-websites-button').click()

    //verify the entry was added
    cy.get('#websites-panel')
      .within(($section) => {
        cy.get('[class="line"]')
      })
      .should('contain', testingData.sidebarWebsitesURL.titleURL)

    //verify url was trimmed
    cy.get('#websites-panel').within(($myPanel) => {
      cy.get('.cy-edit-button').click()
    })
    cy.get('[formcontrolname="url"]').should('not.contain', ' ')
    cy.get('#cancel-websites-button').click()
  })

  afterEach(() => {
    //clean up state
    cy.cleanWebsites()
  })

  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
