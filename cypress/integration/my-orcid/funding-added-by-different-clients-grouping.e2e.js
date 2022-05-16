/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'
const jsonfile = require('../../fixtures/funding-two-sources-grouping.fixture.json')

describe('My orcid - funding duplicates grouping', async function () {
  before(() => {
    const endpoint =
      Cypress.env('membersAPI-URL') +
      userData.cyFundingDuplicatesUser.oid +
      Cypress.env('membersAPI-fundingsEndpoint')

    //add funding with source A
    const curlStatement =
      "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
      userData.cyFundingDuplicatesUser.bearer +
      "' -d '" +
      userData.cyFundingDuplicatesUser.curlPostTwoSourcesPath +
      "' -X POST '" +
      endpoint +
      "'"
    cy.exec(curlStatement).then((response) => {
      //verify curl was executed successfully
      expect(response.code).to.eq(0)
      //verify http response status is successful: 201
      expect(response.stdout).to.contain('HTTP/2 201')
    })
    //add funding with source B
    const curlStatementB =
      "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
      userData.cyFundingDuplicatesUser.clientSource2bearer +
      "' -d '" +
      userData.cyFundingDuplicatesUser.curlPostTwoSourcesPath +
      "' -X POST '" +
      endpoint +
      "'"
    cy.exec(curlStatementB).then((response) => {
      //verify curl was executed successfully
      expect(response.code).to.eq(0)
      //verify http response status is successful: 201
      expect(response.stdout).to.contain('HTTP/2 201')
    })
  })

  it('Same funding added via API by different clients is grouped', function () {
    //grab grant number from funding json file
    const grantNumber =
      jsonfile['external-ids']['external-id']['external-id-value']
    const fundingTitle = jsonfile['title']['title']

    //Login
    cy.programmaticallySignin('cyFundingDuplicatesUser') //send user key from fixture file
    cy.visit(Cypress.env('baseUrl') + `/my-orcid`)
    cy.get('#cy-fundings').should('be.visible') //wait for page to load

    //verify entry was grouped
    cy.contains('app-panel[type="funding"]', grantNumber).within(() => {
      cy.contains('a', 'of 2').click() //REPLACE locator with id
    })
    //verify member source entry is displayed
    cy.contains('app-panel[type="funding"]', fundingTitle).should('be.visible')
  })

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
