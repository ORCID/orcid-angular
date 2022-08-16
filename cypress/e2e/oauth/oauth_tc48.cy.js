/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#48 - authorization link customization
pre-condition: authorization link contains parameters "email=email-not-in-database" + "show_login=true"
1 - visit authorization link
expected: email parameter takes precedence over show_login parameter, therefore user is taken to registration screen as part of OAuth session
*/

describe('OAuth link customization tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = '/person/update'
  const emailParamValue = 'user@email-not-in-database.org'
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code' +
    '&scope=' +
    scope +
    '&email=' +
    emailParamValue +
    '&show_login=true' +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {})

  it('TC#48 authorization link contains email and show_login=true parameters', function () {
    cy.visit(authorizationLink)
    cy.wait(2000)
    cy.url().should('include', Cypress.env('registrationPage'))
    cy.get('#email-input').should('have.value', emailParamValue)
  })

  after(() => {})
})
