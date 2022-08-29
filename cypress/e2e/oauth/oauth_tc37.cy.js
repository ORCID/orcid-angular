/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#37 - missing redirect_uri parameter
pre-condition: authorization link doesn't contain redirect_uri parameter
1 - visit authorization link
expected: user is taken to redirect URI appended with "oauth_error / Please specify a redirect URL"
*/

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = '/person/update'
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code' +
    '&scope=' +
    scope

  before(() => {})

  it('TC#37 missing redirect_uri in authorization takes user to oauth error page', function () {
    cy.visit(authorizationLink)
    cy.wait(2000)
    cy.get('.oauth-error').contains('Please specify a redirect URL')
  })

  after(() => {})
})
