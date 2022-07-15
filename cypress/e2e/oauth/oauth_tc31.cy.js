/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*TC#31
1 - visit authorization link with redirect URI "https://not-my-redirect-uri.com"
2 - sign in with ORCID credentials
expected: user is taken to OAuth error page "invalid_grant / Redirect URI doesn't match your registered redirect URIs"
*/

describe('OAuth cypress tests', async function () {
  const errorMessage_unregistered_uri =
    'does not match the redirect URIs registered by'

  const recordOwner = userData.cyOAuth_RecordOwnerTC31
  const scope = '/read-limited'
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=' +
    scope +
    '&redirect_uri=https://not-my-redirect-uri.com'

  before(() => {
    cy.visit(authorizationLink)
    cy.wait(2000) //need to wait for the redirect to take effect
  })

  it('TC#31 Unregistered authorization link', function () {
    //sign in
    cy.signin(recordOwner)
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.get('#error-message').contains(errorMessage_unregistered_uri)
  })

  after(() => {})
})
