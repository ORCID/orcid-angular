/// <reference types="cypress" />

import userData from '../../fixtures/openID_users.fixture.json'

/* TC#4
Precond: authorization link with openid scope + response_type "token id_token" without nonce parameter
Step: visit authorization link
expected:
- user is sent to OAuth error page with error "invalid_request / Implicit id_token requests must have nonce"
*/

describe('openID test cases', async function () {
  const recordOwner = userData.cyOpenID_RecordOwner1
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOpenID_client1.clientID +
    '&response_type=token id_token&scope=openid&redirect_uri=' +
    userData.cyOpenID_client1.redirect_uri

  before(() => {})

  it('TC#4 - authorization link with openid scope + response_type "token id_token" without nonce parameter', function () {
    cy.visit(authorizationLink)
    cy.contains('Implicit id_token requests must have nonce').should(
      'be.visible'
    )
  })

  after(() => {})
})
