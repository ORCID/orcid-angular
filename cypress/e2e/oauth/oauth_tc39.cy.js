
/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*TC#39 - missing response_type parameter
pre-condition: authorization link doesn't contain response_type parameter
1 - visit authorization link
expected: user is taken to oauth error page "oauth_error / Please specify a response type"
*/

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = '/person/update' 
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&scope=' + scope +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
  })
    
  it('TC#39 missing response type in authorization takes user to oauth error page', function () {
    cy.visit(authorizationLink)
    cy.wait(2000) 
    cy.get('.oauth-error').contains('Please specify a response type')
  })

  after(() => {
  })
})
