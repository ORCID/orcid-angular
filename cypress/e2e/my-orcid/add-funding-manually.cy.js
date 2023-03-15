/// <reference types="cypress" />

import testData from '../../fixtures/affiliations-testing-data.fixture.json'
const uniqueId = require('../../helpers/uniqueEntry')

describe('My orcid - users are able to add funding info in their record', async function () {
  before(() => {
    cy.programmaticallySignin('cyUserPrimaryEmaiVerified') //send user key from fixture file
    cy.visit(Cypress.env('baseUrl') + `/my-orcid`)
    cy.get('#cy-fundings').should('be.visible') //wait for page to load
  })

  it('User adds a funding entry', function () {
    const fundingData = testData.affilliantionFunding
    const uniqueIdentifier = fundingData.grantNumber + `${uniqueId()}`

    cy.get('#cy-fundings').within(($myPanel) => {
      cy.get('#cy-menu-add-funding').click()
    })
    cy.contains('Add manually').should('be.visible').click({ force: true }) //TO DO: replace once element id is added
    cy.get('[formcontrolname="fundingType"]').click()
    cy.get('[role="listbox"]').within(($types) => {
      //TO DO: replace with id for the element when we add it
      cy.contains(fundingData.fundingType).click()
    })
    cy.get('#funding-subtype-input').clear().type(fundingData.fundingSubtype)
    //NOTICE: a unique id is concatenated to the title for verification purposes
    cy.get('#funding-project-title-input')
      .clear()
      .type(fundingData.fundedProjectTitle)

    cy.contains('Add a translated title').click() //TO DO: replace with id for the element when we add it
    cy.get('#funding-project-translated-title-input')
      .clear()
      .type(fundingData.translatedTitle)
    cy.get('#language-title-input').click()
    cy.get('#language-title-input-panel').within(($languages) => {
      cy.contains(fundingData.tranlationLanguage).click()
    })
    cy.get('#funding-project-link-input').clear().type(fundingData.fundingLink)
    cy.get('[formcontrolname="description"]').clear().type(fundingData.description)
    cy.get('[formcontrolname="currencyCode"]').click()
    cy.get('[role="listbox"]').within(($currency) => {
      //TO DO: replace with id for the element when we add it
      cy.contains(fundingData.amountCurrency).click()
    })
    cy.get('#amount-input').clear().type(fundingData.amount)

    //set start date
    cy.get('[formcontrolname="startDateYear"]').click()
    cy.get('[role="listbox"]').within(($date) => {
      cy.contains(fundingData.startYear).click()
    })
    cy.get('[formcontrolname="startDateMonth"]').click()
    cy.get('[role="listbox"]').within(($date) => {
      cy.contains(fundingData.startMonth).click()
    })
    //set end date
    cy.get('[formcontrolname="endDateYear"]').click()
    cy.get('[role="listbox"]').within(($date) => {
      cy.contains(fundingData.endYear).click()
    })
    cy.get('[formcontrolname="endDateMonth"]').click()
    cy.get('[role="listbox"]').within(($date) => {
      cy.contains(fundingData.endMonth).click()
    })
    //add agency info
    cy.get('#funding-agency-name-input').clear().type(fundingData.fundingAgency)
    cy.get('#city-input').clear().type(fundingData.city)
    cy.get('#region-input').clear().type(fundingData.region)
    cy.get('[formcontrolname="country"]').click()
    cy.get('[role="listbox"]').within(($country) => {
      cy.contains(fundingData.country).click()
    })
    //add identifier
    cy.contains('Add an identifier').click() //TO DO: replace with id for the element when we add it
    cy.get('[formcontrolname="grantNumber"]').clear().type(uniqueIdentifier)
    cy.get('[formcontrolname="grantUrl"]').clear().type(fundingData.grantLink)

    //save entry
    cy.get('#save-names-button').click()

    //Verify funding was added looking for the unique grant number
    cy.get('#cy-fundings').should('contain', uniqueIdentifier)
  })

  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
