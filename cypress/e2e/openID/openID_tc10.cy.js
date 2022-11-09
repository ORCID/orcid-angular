/// <reference types="cypress" />

import userData from '../../fixtures/openID_users.fixture.json'

/* TC#10
precondition: authorization link with openid scope + no response_type parameter
steps: visit authorization link
expected: user taken to OAuth error page "oauth_error / Please specify a response type"
*/

describe('openID response type validations', async function () {
  const recordOwner = userData.cyOpenID_RecordOwner1
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOpenID_client1.clientID +
    '&scope=openid&redirect_uri=' +
    userData.cyOpenID_client1.redirect_uri

  before(() => {})

  it('TC#10 - authorization link with openid scope + no response_type parameter ', function () {
    cy.visit(authorizationLink)
    cy.contains('oauth_error / Please specify a response type').should(
      'be.visible'
    )
  })

  after(() => {})
})
