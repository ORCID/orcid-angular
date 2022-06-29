/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/* TC#18
pre-condition: record with valid access token (same scopes)
pre-condition: authorization link only includes scopes already authorized
1 - visit authorization link
2 - sign in with ORCID credentials
result: user is taken to redirect_uri appended with authorization code
*/

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC18
  const scope = '/person/update' //matches authorized scopes in fixture file
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=' +
    scope +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
    cy.visit(authorizationLink)
  })

  it('TC#18 Client signs in with authorized scopes', function () {
    cy.get('#username').clear().type(recordOwner.oid)
    cy.get('#password').clear().type(recordOwner.password)
    cy.get('#signin-button').click()
    cy.wait(3000) //need to wait for the redirect to take effect

    //verify user is taken to redirect_uri with appended authorization code
    cy.url().then((urlString) => {
      cy.url().should('include', userData.cyOAuth_MemberUser.redirect_uri)
      cy.url().should('include', '?code=')
    })
  })

  after(() => {})
})
