/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*TC#23
pre-condition: client ID with registered redirect URI "https://example.com"
pre-condition: user without valid access token
1 - visit authorization link with redirect URI "https://example.com/subpath&parameter=true"
2 - sign in with ORCID credentials
expected: user taken to authorization screen
3 - click button to grant access
expected: user taken to redirect uri appended with authorization code, 
but "&parameter=true" is ignored and removed from the URI
*/

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC23
  const scope = '/read-limited'
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=' +
    scope +
    '&redirect_uri=https://example.com/subpath&parameter=true'


  before(() => {
    cy.visit(authorizationLink)
    cy.wait(2000) //need to wait for the redirect to take effect
  })

  it('TC#23 Authorization link with parameter', function () {
     //sign in
     cy.signin(recordOwner)
     cy.wait(2000) //need to wait for the redirect to take effect
     cy.url().then((urlString) => {
       cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
     })
     cy.get('#authorize-button').click()
     cy.wait(2000) //wait to be redirected
     cy.url().then((urlString) => {
       cy.url().should('include', userData.cyOAuth_MemberUser.redirect_uri_tc22)
       cy.url().should('not.include', '&parameter=true')
     })
  })

  after(() => {})
})