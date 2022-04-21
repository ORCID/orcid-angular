/// <reference types="cypress" />

import testData from '../../fixtures/affiliations-testing-data.fixture.json'
const uniqueId = require('../../helpers/uniqueEntry')

describe('My orcid - users are able to edit distinctions info in their record', async function () {
  before(() => {
    cy.programmaticallySignin('cyUserPrimaryEmaiVerified') //send user key from fixture file
    cy.visit(Cypress.env('baseUrl') + `/my-orcid`)
    cy.get('#cy-affiliation-invited-position-and-distinction') //wait for page to load
  })

  it('User adds distinctions entry with new Organization', function () {
    const testNewOrg = testData.affiliationNewOrg
    const uniqueDistinction = testNewOrg.degree + `${uniqueId()}`

    cy.get('#cy-affiliation-invited-position-and-distinction').within(
      ($myPanel) => {
        cy.get('#cy-menu-add-invited-position').click()
      }
    )
    cy.contains('Add Distinction').click() //TO DO: replace once element id is added

    cy.get('#organization-input').clear().type(testNewOrg.name)
    cy.get('#city-input').clear().type(testNewOrg.city)
    cy.get('#region-input').clear().type(testNewOrg.region)
    cy.get('#country-input').click()
    cy.get('[role="listbox"]').within(($countries) => {
      //TO DO: replace with id for the element when we add it
      cy.contains(testNewOrg.country).click()
    })
    cy.get('#department-input').clear().type(testNewOrg.dept)
    //NOTICE: a unique id is concatenated to the distinction for verification purposes
    cy.get('#title-input').clear().type(uniqueDistinction)
    //set award/distinction date
    cy.get('#cy-start-date-year-sel').click()
    cy.get('#cy-start-date-year-sel-panel').within(($date) => {
      cy.contains(testNewOrg.startDate_year).click()
    })
    cy.get('#cy-start-date-month-sel').click()
    cy.get('#cy-start-date-month-sel-panel').within(($date) => {
      cy.contains(testNewOrg.startDate_month).click()
    })
    cy.get('#cy-start-date-day-sel').click()
    cy.get('#cy-start-date-day-sel-panel').within(($date) => {
      cy.contains(testNewOrg.startDate_day).click()
    })
    cy.get('#url-input').clear().type(testNewOrg.link)
    cy.get('#save-affiliation-button').click()

    //Verify education was added looking for the unique degree
    cy.get('#cy-affiliation-invited-position-and-distinction').should(
      'contain',
      uniqueDistinction
    )
  })

  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
