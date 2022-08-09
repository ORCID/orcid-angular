
/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#36 - missing scope parameter
pre-condition: authorization link doesn't contain scope parameter
1 - visit authorization link
expected: user is taken to OAuth error page "oauth_error / Please specify the desired scopes"
*/

describe('OAuth cypress tests', async function () {

  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const authorizationLink =
  'https://qa.orcid.org/oauth/authorize?client_id=' +
  userData.cyOAuth_MemberUser.clientID +
  '&response_type=code'+
  '&redirect_uri=' +
  userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
  })
    
  it('TC#36 missing scope in authorization takes user to oauth error page', function () {
    cy.visit(authorizationLink)
    cy.wait(2000) 
    cy.get('.oauth-error').contains('Please specify the desired scopes')
  })

  after(() => {
  })
})
