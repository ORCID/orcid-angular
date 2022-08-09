
/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#35 - invalid scope
pre-condition: authorization link contains invalid scope e.g. "scope=invalid_scope"
1 - visit authorization link
expected: user is taken to redirect URI appended with "#error=invalid_scope"
*/

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = 'invalid_scope' 
  const authorizationLink =
  'https://qa.orcid.org/oauth/authorize?client_id=' +
  userData.cyOAuth_MemberUser.clientID +
  '&response_type=code'+
  '&scope=' + scope +
  '&redirect_uri=' +
  userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
  })

  it('TC#35 invalid scope in authorization takes user to redirect uri with error appended', function () {
    cy.visit(authorizationLink)
    cy.wait(2000) 
    cy.signin(recordOwner)
    cy.url().then((urlString) => {
        cy.url().should('include', '#error=invalid_scope')
      })
  })
  after(() => {
  })
})
