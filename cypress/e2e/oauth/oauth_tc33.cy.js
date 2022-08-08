
/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#33 invalid client ID
pre-condition: authorization link contains invalid client ID e.g. "APP-0W6BNW12C2OOLJ3E-invalid"
1 - visit authorization link
expected: user is taken to OAuth error page "<invalid client id> is invalid"
*/

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = '/person/update' 
  const invalid_client_id= 'APP-0W6BNW12C2OOLJ3E-invalid'
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    invalid_client_id +
    '&response_type=code&scope=' +
    scope +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
  })

  
  it('TC#32 authorization link with invalid client id results in error message', function () {
    cy.visit(authorizationLink)
    cy.wait(2000) 
    cy.get('#error-message').contains(invalid_client_id+' is invalid')
  })

  after(() => {
  })
})
