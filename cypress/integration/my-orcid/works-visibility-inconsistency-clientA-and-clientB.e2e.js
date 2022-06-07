/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'
const jsonfile = require('../../fixtures/work-visibility-different-clients.fixture.json')

describe('My orcid - works - visibility inconsistency notification scenarios', async function () {
  /* Scenario:
  Precondition: record has visibility set to Private
  Steps:
    POST a work with client A which will take record Private visibility
    Change record visibility setting to Public
    POST same work with client B which will take record Public visibility
    Inconsistency icon is displayed next to Visibility "buttons"
    Select a visibility setting for the group of works
    Inconsistency icon is not displayed anymore
  */

  before(() => {
    //Set default visibility to PRIVATE(ONLY ME)
    cy.programmaticallySignin('cyWorkVisibilityUser') //send user key from fixture file
    cy.visit(Cypress.env('baseUrl') + `/my-orcid`)
    cy.get('#cy-user-info').click()
    cy.get('#cy-account-settings').click()
    cy.get('#cy-visibility-panel-action-more').click()
    cy.get('#cy-visibility-private-input').click()
    //Log out to save changes
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })

  it('Work added different clients: Verify visibility inconsistency icon is displayed if visibility is different', function () {
    //grab id from work json file
    const externalId =
      jsonfile['external-ids']['external-id']['external-id-value']

    //add a new work with client A which will take PRIVATE default visibility
    const endpoint =
      Cypress.env('membersAPI-URL') +
      userData.cyWorkVisibilityUser.oid +
      Cypress.env('membersAPI-workEndpoint')

    const curlStatementA =
      "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
      userData.cyWorkVisibilityUser.client1bearer +
      "' -d '" +
      userData.cyWorkVisibilityUser.curlPostWorkClientsPath +
      "' -X POST '" +
      endpoint +
      "'"
    cy.exec(curlStatementA).then((response) => {
      //verify curl was executed successfully
      expect(response.code).to.eq(0)
      //verify http response status is successful: 201
      expect(response.stdout).to.contain('HTTP/2 201')
    })

    //change visibility to Public
    cy.programmaticallySignin('cyWorkVisibilityUser') //send user key from fixture file
    cy.visit(Cypress.env('baseUrl') + `/my-orcid`)
    cy.get('#cy-user-info').click()
    cy.get('#cy-account-settings').click()
    cy.get('#cy-visibility-panel-action-more').click()
    cy.get('#cy-visibility-everyone-input').click()
    //Log out to save changes
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })

    //add a new work with client B which will take PUBLIC default visibility
    const curlStatementB =
      "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
      userData.cyWorkVisibilityUser.client2bearer +
      "' -d '" +
      userData.cyWorkVisibilityUser.curlPostWorkClientsPath +
      "' -X POST '" +
      endpoint +
      "'"
    cy.exec(curlStatementB).then((response) => {
      //verify curl was executed successfully
      expect(response.code).to.eq(0)
      //verify http response status is successful: 201
      expect(response.stdout).to.contain('HTTP/2 201')
    })

    //Sign in and got to my orcid page
    cy.programmaticallySignin('cyWorkVisibilityUser') //send user key from fixture file
    cy.visit(Cypress.env('baseUrl') + `/my-orcid`)

    //Verify work was added and grouped & inconsistency icon is displayed
    cy.get('#cy-works') //wait for page to load
    cy.contains('app-work-stack', externalId).within(() => {
      cy.contains('a', 'of 2') //REPLACE locator with id
      //verify icon is displayed
      cy.get('#cy-buttons-container').within(() => {
        cy.get('#cy-inconsistency-issue').should('be.visible')
      })
      //select group visibility & verify icon is not displayed
      cy.get('mat-checkbox').click()
      cy.get('#cy-visibility-limited').click()
      cy.wait(2000) //wait for change to take effect
      cy.get('#cy-buttons-container').within(() => {
        cy.get('#cy-inconsistency-issue').should('not.exist')
      })
    })
  })

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
