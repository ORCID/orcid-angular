/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#46 - authorization link customization
pre-condition: authorization link contains parameter "email=email-not-in-database"
1 - visit authorization link
expected: user is taken to registration screen as part of OAuth session and primary email address field is populated with address from email parameter
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
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {})

  it('TC#46 authorization link contains email parameter', function () {
    cy.visit(authorizationLink)
    cy.wait(2000)
    cy.url().should('include', Cypress.env('registrationPage'))
    cy.get('#email-input').should('have.value', emailParamValue)
  })

  after(() => {})
})
