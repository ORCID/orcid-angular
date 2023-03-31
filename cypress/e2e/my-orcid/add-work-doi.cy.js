/// <reference types="cypress" />

import testData from '../../fixtures/affiliations-testing-data.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('My orcid - users are able to edit work info in their record', async function () {
  before(() => {
    cy.programmaticallySignin('cyUserPrimaryEmaiVerified') //send user key from fixture file
    cy.visit('/my-orcid')
  })

  qase(
    '79',
    it('User adds work by DOI and without modifying manually', function () {
      const testWorks = testData.affilliantionWorks

      cy.get('#cy-works', { timeout: 6000 }).within(($myPanel) => {
        cy.get('#cy-menu-add-works').click()
      })
      cy.get('#cy-add-work-doi').click({ force: true })
      cy.get('#external-id-input').clear().type(testWorks.DOI)
      cy.get(`[id^='cy-retrieve-work-details']`).click()
      cy.get('#save-work-button').wait(1000).click({ force: true }) //wait for modal to display
      //Verify work was added
      cy.get('#cy-works', { timeout: 6000 }).should(
        'contain',
        testWorks.workTitleDOI
      )
    })
  ) //end of qase tag
  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
