
/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*TC#38 - invalid response_type
pre-condition: authorization link contains invalid response_type e.g. "response_type=invalid_response"
1 - visit authorization link
expected: user is taken to redirect URI appended with "#error=unsupported_response_type"

*/

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = '/person/update' 
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=invalid_response'+
    '&scope=' + scope +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
  })
    
  it('TC#38 invalid response type in authorization takes user to redirect uri with error appended', function () {
    cy.visit(authorizationLink)
    cy.wait(2000) 
    cy.signin(recordOwner)
    cy.url().then((urlString) => {
      cy.url().should('include', '#error=unsupported_response_type')
    })
  })

  after(() => {
  })
})
