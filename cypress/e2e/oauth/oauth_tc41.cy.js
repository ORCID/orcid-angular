/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#41 - authorization link customization
pre-condition: authorization link contains parameter "show_login=false"
1 - visit authorization link
expected: user is taken to registration screen as part of OAuth session
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
    '&show_login=false' +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {})

  it('TC#41 authorization link contains parameter "show_login=false"', function () {
    cy.visit(authorizationLink)
    cy.wait(2000) 
    cy.url().should('include', 'register')
    .and('include', userData.cyOAuth_MemberUser.clientID)
  })

  after(() => {})
})
