
/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

 /*
TC#43 - authorization link customization
pre-condition: authorization link contains parameter "state=my-test-state"
1 - visit authorization link
2 - sign in with ORCID credentials
3 - click button to grant access
expected: user is taken to redirect_uri appended with authorization code as well as state parameter defined in authorization link
 */ 

 describe('OAuth link customization tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = '/person/update' 
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code'+
    '&scope=' + scope +
    '&state=my-test-state'+
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
  })

  it('TC#43 authorization link contains parameter "state=my-test-state"', function () {
    cy.visit(authorizationLink)
    cy.wait(2000) 
    cy.signin(recordOwner)
    cy.wait(2000) 
    cy.get('#authorize-button').click()
    cy.url().should('include', userData.cyOAuth_MemberUser.redirect_uri)
    .and('include', '?code=')
    .and('include', 'state=my-test-state')
  })

  after(() => {
  })
})
