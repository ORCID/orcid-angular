/// <reference types="cypress" />

import userData from '../../fixtures/openID_users.fixture.json'

/* TC#11
- visit authorization link
- sign in with ORCID credentials
- click button to grant access
expected:
- OAuth session is completed successfully and access is granted
- implicit OAuth response is generated (access token is returned in browser)
- no id_token returned
*/

describe('openID test cases', async function () {
  const recordOwner = userData.cyOpenID_RecordOwner11
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOpenID_client1.clientID +
    '&response_type=token&scope=/authenticate&redirect_uri=' +
    userData.cyOpenID_client1.redirect_uri

  before(() => {})

  it('TC#11 - authorization link with "/authenticate" scope + response_type "token"', function () {
    cy.visit(authorizationLink)
    cy.signin(recordOwner)
    //grant access
    cy.get('#authorize-button').click({ timeout: 4000 })
    cy.url().then((urlString) => {
      cy.log('responseURL: ' + urlString)
    })
    cy.url().should('include', '#access_token=')
    cy.url().should('not.include', 'id_token=')
  })

  after(() => {})
})
