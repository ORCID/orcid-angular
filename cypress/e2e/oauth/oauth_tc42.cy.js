/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#42 - authorization link customization
pre-condition: authorization link contains parameter "show_login=true"
1 - visit authorization link
expected: user is taken to signin screen as part of OAuth session
 */

describe('OAuth link customization tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = '/person/update'
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code' +
    '&scope=' +
    scope +
    '&show_login=true' +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {})

  it('TC#42 authorization link contains parameter "show_login=true"', function () {
    cy.visit(authorizationLink)
    cy.wait(2000)
    //verify user is redirected to Sign in page
    cy.url()
      .should('contain', Cypress.env('signInURL'))
      .and('include', userData.cyOAuth_MemberUser.clientID)
  })

  after(() => {})
})
