/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#34 - missing client_id parameter
pre-condition: authorization link doesn't contain client_id parameter
1 - visit authorization link
expected: user is taken to OAuth error page "oauth_error / Please specify a client id"
*/

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = '/person/update'
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    '&response_type=code&scope=' +
    scope +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {})

  it('TC#34 missing client id in authorization link results in error message', function () {
    cy.visit(authorizationLink)
    cy.wait(2000)
    cy.get('.oauth-error').contains('Client not found')
  })

  after(() => {})
})
