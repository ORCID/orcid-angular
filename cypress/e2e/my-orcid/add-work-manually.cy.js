/// <reference types="cypress" />

import testData from '../../fixtures/affiliations-testing-data.fixture.json'

describe('My orcid - users are able to edit work info in their record', async function () {
  before(() => {
    cy.programmaticallySignin('cyUserPrimaryEmaiVerified') //send user key from fixture file
    cy.visit('/my-orcid')
    cy.get('#cy-works') //wait for page to load
  })

  it('User adds work manually', function () {
    const testWorks = testData.affilliantionWorks

    cy.get('#cy-works').within(($myPanel) => {
      cy.get('#cy-menu-add-works').click()
    })
    cy.get('#cy-add-work-manually').click({ force: true })
    cy.get('#cy-work-types').click()
    cy.get('#cy-work-types-panel').within(($myOptions) => {
      cy.contains(testWorks.manuallyType).click()
    })
    cy.get('#title-input').clear().type(testWorks.manuallyTitle)
    //add translated title
    cy.get('#cy-translated-title-toggle-link').click()
    cy.get('#cy-translated-title-content')
      .clear()
      .type(testWorks.manuallyTranslatedTitle)
    cy.get('#language-of-title-input').click()
    cy.get('#language-of-title-input-panel').within(($languages) => {
      cy.contains(testWorks.manuallyLanguage).click()
    })
    //add publication details
    cy.get('#work-subtitle-input').clear().type(testWorks.manuallySubtitle)
    cy.get('#cy-journal-title').clear().type(testWorks.manuallyJournalTitle)
    cy.get('#cy-start-date-year-sel').click()
    cy.get('#cy-start-date-year-sel-panel').within(($list) => {
      cy.contains(testWorks.manuallyYear).click()
    })
    cy.get('#cy-start-date-month-sel').click()
    cy.get('#cy-start-date-month-sel-panel').within(($list) => {
      cy.contains(testWorks.manuallyMonth).click()
    })
    cy.get('#cy-start-date-day-sel').click()
    cy.get('#cy-start-date-day-sel-panel').within(($list) => {
      cy.contains(testWorks.manuallyDay).click()
    })
    cy.get('#url-input').clear().type(testWorks.manuallyLink)
    //add citation
    cy.get('#cy-citation-type').click()
    cy.get('#cy-citation-type-panel').within(($list) => {
      cy.contains(testWorks.manuallyCitationType).click()
    })
    cy.get('#citation-input').clear().type(testWorks.manuallyCitation)
    cy.get('[formcontrolname="shortDescription"]')
      .clear()
      .type(testWorks.manuallyCitationDesc)
    //add identifier
    cy.get('#cy-add-an-work-external-id').click()
    cy.get('[formcontrolname="externalIdentifierType"]').click() //to do REPLACE with id for the element next sprint
    cy.get('[role="listbox"]').within(($list) => {
      //to do REPLACE with id for the element next sprint
      cy.contains(testWorks.manuallyIdentifierType).click()
    })
    cy.get('[formcontrolname="externalIdentifierId"]')
      .clear()
      .type(testWorks.manuallyIdentifierId)
    cy.get('[formcontrolname="externalIdentifierUrl"]')
      .clear()
      .type(testWorks.manuallyIdentifierLink)
    //by default Self relationship is checked
    //once IDs are added we can add logic to choose what fixture file indicates

    cy.get('#language-input').click()
    cy.get('#language-input-panel').within(($list) => {
      cy.contains(testWorks.manuallyFormLanguage).click()
    })
    cy.get('#country-input').click()
    cy.get('#country-input-panel').within(($list) => {
      cy.contains(testWorks.manuallyFormCountry).click()
    })

    //by default visibility is set to public,
    //change it in case test data indicates limited/private
    cy.get('#modal-container').within(($modal) => {
      if (testWorks.manuallyVisibility == 'limited') {
        cy.get('#cy-visibility-limited').click()
      } else {
        if (testWorks.manuallyVisibility == 'private') {
          cy.get('.cy-visibility-private').click()
        }
      }
    })
    //save entry
    cy.get('#save-work-button').wait(1000).click({ force: true })

    //Verify work was added
    cy.get('#cy-works', { timeout: 10000 }).should(
      'contain',
      testWorks.manuallyTitle
    )
  })

  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
