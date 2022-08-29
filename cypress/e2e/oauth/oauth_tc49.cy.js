// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#49 - authorization link customization
pre-condition: authorization link contains parameters "email=email-not-in-database" + "given_names=Jane" + "family_names=Doe"
1 - visit authorization link
expected: user is taken to registration screen as part of OAuth
expected: registration screen is populated with email address, given name, and family name
*/

describe('OAuth link customization tests', async function () {
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
    '&given_names=Jane' + 
    '&family_names=Doe'+
    '&show_login=true' +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {})

  it('TC#49 authorization link contains email given and family names parameters', function () {
    cy.visit(authorizationLink)
    cy.wait(2000)
    cy.url().should('include', Cypress.env('registrationPage'))
    cy.get('#email-input').should('have.value', emailParamValue)
    cy.get('#given-names-input').should('have.value', 'Jane')
    cy.get('#family-names-input').should('have.value', 'Doe')
  })

  after(() => {})
})