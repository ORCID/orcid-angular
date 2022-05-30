/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'
const jsonfile = require('../../fixtures/work-visibility.fixture.json')

describe('My orcid - works - visibility inconsistency notification scenario', async function () {
  /* Scenario:
  Precondition: record has visibility set to Public
  Steps:
    POST a work which will take default Public visibility
    Add same work manually editing visibility to Private
    Inconsistency icon is displayed next to Visibility "buttons"
    Select a visibility setting for the group of works
    Inconsistency icon is not displayed anymore
  */

  before(() => {
    //Set default visibility for this record is set to Public
    cy.programmaticallySignin('cyWorkVisibilityUser') //send user key from fixture file
    cy.visit(Cypress.env('baseUrl') + `/my-orcid`)
    cy.get('#cy-user-info').click()
    cy.get('#cy-account-settings').click()
    cy.get('#cy-visibility-panel-action-more').click()
    cy.get('#cy-visibility-everyone-input').click()
    //Log out to save changes
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })

  it('Work added by owner & client: Verify visibility inconsistency icon is displayed if visibility is different', function () {
    //grab external id from json file
    const externalId =
      jsonfile['external-ids']['external-id']['external-id-value']

    //add a new work with client A which will take PUBLIC default visibility for this record owner
    const endpoint =
      Cypress.env('membersAPI-URL') +
      userData.cyWorkVisibilityUser.oid +
      Cypress.env('membersAPI-workEndpoint')

    const curlStatement =
      "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
      userData.cyWorkVisibilityUser.client1bearer +
      "' -d '" +
      userData.cyWorkVisibilityUser.curlPostWorkPath +
      "' -X POST '" +
      endpoint +
      "'"
    cy.exec(curlStatement).then((response) => {
      //verify curl was executed successfully
      expect(response.code).to.eq(0)
      //verify http response status is successful: 201
      expect(response.stdout).to.contain('HTTP/2 201')
    })

    //Login
    cy.programmaticallySignin('cyWorkVisibilityUser') //send user key from fixture file
    cy.visit(Cypress.env('baseUrl') + `/my-orcid`)
    cy.get('#cy-works').should('be.visible') //wait for page to load

    //verify work added by client is displayed
    cy.get('#cy-works').should('contain', externalId)

    //add same work manually with PRIVATE visibility
    cy.get('#cy-works').within(($myPanel) => {
      cy.get('#cy-menu-add-works').click()
    })
    cy.get('#cy-add-work-manually').click({ force: true })
    cy.get('#cy-work-types').click()
    const strTypeJson = jsonfile['type']
    //valkues in UI start with capital letter
    const strTypeOption =
      strTypeJson.charAt(0).toUpperCase() + strTypeJson.slice(1)
    cy.get('#cy-work-types-panel').within(($myOptions) => {
      cy.contains(strTypeOption).click()
    })
    cy.get('#title-input').clear().type(jsonfile['title']['title']['value'])
    //add identifier
    cy.get('#cy-add-an-work-external-id').click()
    cy.get('[formcontrolname="externalIdentifierType"]').click() //to do REPLACE with id for the element next sprint
    cy.get('[role="listbox"]').within(($list) => {
      //to do REPLACE with id for the element next sprint
      cy.contains(
        jsonfile['external-ids']['external-id']['external-id-type']
      ).click()
    })
    cy.get('#external-identifier-id-input')
      .clear()
      .type(jsonfile['external-ids']['external-id']['external-id-value'])

    //by default visibility is set to public, change it to Private
    cy.get('#modal-container').within(($modal) => {
      cy.get('#cy-visibility-private').click()
    })
    //save entry
    cy.get('#save-work-button').click({ force: true })
    cy.wait(2000) //wait for change to take effect

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
