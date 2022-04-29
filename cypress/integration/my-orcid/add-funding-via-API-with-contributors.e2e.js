/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'
const jsonfile = require("../../fixtures/funding-with-contributors.fixture.json")

describe('My orcid - via API members can add fundings', async function () {

  before(() => { 
    //add a new funding via API
    const endpoint =
      Cypress.env('membersAPI-URL') +
      userData.cyFundingContributorsUser.oid +
      Cypress.env('membersAPI-fundingsEndpoint')

    const curlStatement =
      "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
      userData.cyFundingContributorsUser.bearer +
      "' -d '" +
      userData.cyFundingContributorsUser.curlPostFundingPath +
      "' -X POST '" +
      endpoint +
      "'"
    cy.exec(curlStatement).then((response) => {
      //verify curl was executed successfully
      expect(response.code).to.eq(0)
      //verify http response status is successful: 201
      expect(response.stdout).to.contain("HTTP/2 201")
    })

  })

  it('New funding with contributors added via API is displayed correctly', function () {
    
    //grab grant number from funding json file
    const grantNumber = jsonfile['external-ids']['external-id']['external-id-value']

    //Login
    cy.programmaticallySignin('cyFundingContributorsUser') //send user key from fixture file
    cy.visit(Cypress.env('baseUrl') + `/my-orcid`)
    cy.get('#cy-fundings').should('be.visible') //wait for page to load
  
    //verify funding was added to the account
    cy.get('#cy-fundings').should('contain', grantNumber)

    cy.get('#cy-fundings').within(()=>{
      cy.contains('Show more detail').click() //REPLACE locator with id
    })
    //verify contributors info is displayed
    cy.get('#cy-fundings').should('contain', 'Contributors') //REPLACE locator with id
  
  })

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
