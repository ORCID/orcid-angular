/// <reference types="cypress" />

import testData from '../../fixtures/affiliations-testing-data.fixture.json'
const uniqueId = require('../../helpers/uniqueEntry')

describe('My orcid - users are able to edit education info in their record', async function () {
  before(() => {
    cy.programmaticallySignin('cyUserPrimaryEmaiVerified') //send user key from fixture file
    cy.visit(Cypress.env('baseUrl') + `/my-orcid`)
    cy.get('#cy-affiliation-education-and-qualification') //wait for page to load
  })

  it('User adds education entry with new Organization', function () {
    const testNewOrg = testData.affiliationNewOrg
    const uniqueDegree = testNewOrg.degree + `${uniqueId()}`

    cy.get('#cy-affiliation-education-and-qualification').within(($myPanel) => {
      cy.get('#cy-menu-add-education').click()
    })
    cy.contains('Add Education').click() //TO DO: replace once element id is added

    cy.get('#organization-input').clear().type(testNewOrg.name)
    cy.get('#city-input').clear().type(testNewOrg.city)
    cy.get('#region-input').clear().type(testNewOrg.region)
    cy.get('#country-input').click()
    cy.get('[role="listbox"]').within(($countries) => {
      //TO DO: replace with id for the element when we add it
      cy.contains(testNewOrg.country).click()
    })
    cy.get('#department-input').clear().type(testNewOrg.dept)
    //NOTICE: a unique id is concatenated to the degree for verification purposes
    cy.get('#title-input').clear().type(uniqueDegree)
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

    //Verify education was added looking for the unique degree
    cy.get('#cy-affiliation-education-and-qualification').should(
      'contain',
      uniqueDegree
    )
  })

  /* THIS SCENARIO WILL BE INCLUDED IN THE FUTURE
  it('User adds education entry with existing Organization', function () {
    const testExistingOrg=testData.affiliationExistingOrg

    cy.get('app-affiliations').within(($myPanel) => {
      cy.get('button[aria-label="Add Education"]').click() //TO DO: replace once element id is added
    })
    cy.contains("Add Education").click() //TO DO: replace once element id is added

    cy.get('#organization-input').type(testExistingOrg.name)
    cy.get('[role="listbox"]').within(($orgs) => { //replace with id for the element when we add it 
      cy.contains(testExistingOrg.name).click()
    })
    //provide additional education details
    cy.get('#department-input').clear().type(testExistingOrg.dept)
    cy.get('#title-input').clear().type(testExistingOrg.degree)
    //set start date
    cy.get('#start-date-year-input').click() 
    cy.get('[role="listbox"]').within(($date) => { //replace with id for the element when we add it 
      cy.contains(testExistingOrg.startDate_year).click()
    })
    cy.get('#start-date-month-input').click()
    cy.get('[role="listbox"]').within(($date) => { //replace with id for the element when we add it 
      cy.contains(testExistingOrg.startDate_month).click()
    })
    cy.get('#start-date-day-input').click()
    cy.get('[role="listbox"]').within(($date) => { //replace with id for the element when we add it 
      cy.contains(testExistingOrg.startDate_day).click()
    })
    //set end date
    cy.get('#end-date-year-input').click() 
    cy.get('[role="listbox"]').within(($date) => { //replace with id for the element when we add it 
      cy.contains(testExistingOrg.endDate_year).click()
    })
    cy.get('#end-date-month-input').click()
    cy.get('[role="listbox"]').within(($date) => { //replace with id for the element when we add it 
      cy.contains(testExistingOrg.endDate_month).click()
    })
    cy.get('#end-date-day-input').click()
    cy.get('[role="listbox"]').within(($date) => { //replace with id for the element when we add it 
      cy.contains(testExistingOrg.endDate_day).click()
    })
    cy.get('#url-input').clear().type(testExistingOrg.link)
    cy.get('#save-affiliation-button').click()
    
    //Verify employment was added
    cy.get('app-panel').should('contain',testExistingOrg.name)
  })
*/
  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
