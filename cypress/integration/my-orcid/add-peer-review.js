/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'
const jsonfile = require('../../fixtures/peer-review.fixture.json')

describe('My orcid - via API members can add Peer reviews', async function () {
  before(() => {
    //add a new peer review via API
    const endpoint =
      Cypress.env('membersAPI-URL') +
      userData.cyUserPrimaryEmaiVerified.oid +
      Cypress.env('membersAPI-peerReviewEndpoint')

    const curlStatement =
      "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
      userData.cyUserMemmerAPI.bearer +
      "' -d '" +
      userData.cyUserMemmerAPI.curlPostPeerReviewPath +
      "' -X POST '" +
      endpoint +
      "'"
    cy.exec(curlStatement).then((response) => {
      //verify curl was executed successfully
      expect(response.code).to.eq(0)
      //verify http response status is successful: 201
      expect(response.stdout).to.contain('HTTP/2 201')
    })
  })

  it('New Peer Review added via API is displayed correctly', function () {
    //grab review group id number
    const groupId = jsonfile['review-group-id']

    //Login
    cy.programmaticallySignin('cyUserPrimaryEmaiVerified') //send user key from fixture file
    cy.visit(Cypress.env('baseUrl') + `/my-orcid`)
    cy.get('#cy-peer-reviews').should('be.visible') //wait for page to load

    //verify Peer Review was added to the record
    cy.get('#cy-panel-component-expand-button').click()
    //check for the correct review group id
    cy.get('#cy-peer-reviews').should('contain', groupId.split(':')[1])
  })

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
