/// <reference types="cypress" />

import userData from '../../fixtures/openID_users.fixture.json'

/* TC#9
precondition: authorization link with openid scope + empty response_type
steps: visit authorization link
expected: user is taken to redirect_uri appended with "#error=unsupported_response_type"
*/

describe('openID response type validations', async function () {
  const recordOwner = userData.cyOpenID_RecordOwner1
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOpenID_client1.clientID +
    '&response_type=&scope=openid&redirect_uri=' +
    userData.cyOpenID_client1.redirect_uri

  before(() => {})

  it('TC#9 - authorization link with openid scope + empty response_type', function () {
    cy.visit(authorizationLink)
    cy.signin(recordOwner)
    cy.wait(2000)
    cy.url().should('include', '#error=unsupported_response_type')
  })

  after(() => {})
})
