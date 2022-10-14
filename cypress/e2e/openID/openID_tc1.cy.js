/// <reference types="cypress" />

import userData from '../../fixtures/openID_users.fixture.json'

/* TC#1
- visit authorization link
- sign in with ORCID credentials
- click button to grant access
expected:
- OAuth request returns short-lived access token (10 minutes)
- OAuth request returns id_token
- response_type ""token"" generates an implicit OAuth response
- implicit OAuth response uses URL fragments not query parameters (i.e. # not ?)
*/

describe('openID test cases', async function () {
  const recordOwner = userData.cyOpenID_RecordOwner1
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOpenID_client1.clientID +
    '&response_type=token&scope=openid&redirect_uri=' +
    userData.cyOpenID_client1.redirect_uri

  before(() => {})

  it('TC#1 - authorization link with openid scope + response_type "token"', function () {
    cy.visit(authorizationLink)
    cy.signin(recordOwner)
    //grant access
    cy.get('#authorize-button').click({ timeout: 4000 })
    cy.url().then((urlString) => {
      cy.log('responseURL: ' + urlString)
    })
    cy.url().should('include', '#access_token=')
    cy.url().should('include', 'id_token=')
  })

  after(() => {})
})
