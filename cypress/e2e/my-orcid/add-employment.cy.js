/// <reference types="cypress" />

import testData from '../../fixtures/affiliations-testing-data.fixture.json'
const uniqueId = require('../../helpers/uniqueEntry')

describe('My orcid - users are able to edit employment info in their record', async function () {
  before(() => {
    cy.programmaticallySignin('cyUserPrimaryEmaiVerified') //send user key from fixture file
    cy.visit('/my-orcid')
    cy.get('#cy-affiliation-employment') //wait for page to load
  })

  it('User adds employment with new Organization', function () {
    const testNewOrg = testData.affiliationNewOrg
    const uniqueRole = testNewOrg.role + `${uniqueId()}`

    cy.get('#cy-affiliation-employment').within(($myPanel) => {
      cy.get('#cy-add-btn-employment').click()
    })
    //user types org name
    cy.get('#organization-input').clear().type(testNewOrg.name)

    cy.get('#city-input').clear().type(testNewOrg.city)
    cy.get('#region-input').clear().type(testNewOrg.region)
    cy.get('[formcontrolname="country"]').click() //REPLACE locator with id once it is added
    cy.get('[role="listbox"]').within(($countries) => {
      //REPLACE locator with id once it is added
      cy.contains(testNewOrg.country).click()
    })
    cy.get('#department-input').clear().type(testNewOrg.dept)
    cy.get('#title-input').clear().type(uniqueRole)
    //set start date
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
    //set end date
    cy.get('#cy-end-date-year-sel').click()
    cy.get('#cy-end-date-year-sel-panel').within(($date) => {
      cy.contains(testNewOrg.endDate_year).click()
    })
    cy.get('#cy-end-date-month-sel').click()
    cy.get('#cy-end-date-month-sel-panel').within(($date) => {
      cy.contains(testNewOrg.endDate_month).click()
    })
    cy.get('#cy-end-date-day-sel').click()
    cy.get('#cy-end-date-day-sel-panel').within(($date) => {
      cy.contains(testNewOrg.endDate_day).click()
    })
    cy.get('#url-input').clear().type(testNewOrg.link)
    cy.get('#save-affiliation-button').click()

    //Verify employment was added
    cy.get('#cy-affiliation-employment').should('contain', uniqueRole)
  })

  /* THIS SCENARIO WILL BE INCLUDED LATER ON
  it('User adds employment with existing org from drop down list', function () {
    const testExistingOrg=testData.affiliationExistingOrg

    cy.get('#cy-affiliation-employment').within(($myPanel) => {
      cy.get('#cy-add-btn-employment').click() 
    })
    cy.get('#cy-org-dd-mat-form').type(testExistingOrg.name)    
    cy.get('[role="listbox"]').within(($orgs) => { //pending: REPLACE locator with id
      cy.contains(testExistingOrg.name).click({force:true})
    })
    //provide additional employment details
    cy.get('#department-input').clear().type(testExistingOrg.dept)
    cy.get('#title-input').clear().type(testExistingOrg.role)
    //set start date
    cy.get('#cy-start-date-year-sel').click() 
    cy.get('#cy-start-date-year-sel-panel').within(($date) => { 
      cy.contains(testExistingOrg.startDate_year).click()
    })
    cy.get('#cy-start-date-month-sel').click()
    cy.get('#cy-start-date-month-sel-panel').within(($date) => { 
      cy.contains(testExistingOrg.startDate_month).click()
    })
    cy.get('#cy-start-date-day-sel').click()
    cy.get('#cy-start-date-day-sel-panel').within(($date) => { 
      cy.contains(testExistingOrg.startDate_day).click()
    })
    //set end date
    cy.get('#cy-end-date-year-sel').click() 
    cy.get('#cy-end-date-year-sel-panel').within(($date) => {  
      cy.contains(testExistingOrg.endDate_year).click()
    })
    cy.get('#cy-end-date-month-sel').click()
    cy.get('#cy-end-date-month-sel-panel').within(($date) => { 
      cy.contains(testExistingOrg.endDate_month).click()
    })
    cy.get('#cy-end-date-day-sel').click()
    cy.get('#cy-end-date-day-sel-panel').within(($date) => { 
      cy.contains(testExistingOrg.endDate_day).click()
    })
    cy.get('#url-input').clear().type(testExistingOrg.link)
    cy.get('#save-affiliation-button').click()
    
    //Verify employment was added
    cy.get('#cy-affiliation-employment').should('contain',testExistingOrg.name)
  })
*/

  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
