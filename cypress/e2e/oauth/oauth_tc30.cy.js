/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#30 replaced by Qase #64 and #66
pre-condition: client id with registered redirect URI 
containing trailing whitespace e.g. ``https://example.com ``
*/

describe('Registered redirect uri contains trailing whitespaces', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC30
  const scope = '/read-limited'
  //NOTE: partial auth link to append different uris
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberTC30.clientID +
    '&response_type=code&scope=' +
    scope +
    '&redirect_uri='

  beforeEach(() => {
    //sign in
    cy.visit(Cypress.env('signInURL'))
    cy.signin(recordOwner)
    cy.wait(2000) //need to wait for the redirect to take effect
  })

  it('QASE#64_positive_1', function () {
    //visit authorization link with redirect URI https://example.com/subpath
    //expected: user taken to authorization screen
    cy.visit(authorizationLink + 'https://example.com/subpath')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    cy.get('#authorize-button').should('be.visible')
  })

  it('QASE#64_positive_2', function () {
    //visit authorization link with redirect URI https://example.com
    //expected: user taken to authorization screen
    cy.visit(authorizationLink + 'https://example.com')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    cy.get('#authorize-button').should('be.visible')
  })

  it('QASE#66_negative_1', function () {
    //visit authorization link with redirect URI https://subdomain1.example.com
    //expected: user taken to oauth error page
    cy.visit(authorizationLink + 'https://subdomain1.example.com')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.contains(
      `Redirect URI doesn't match your registered redirect URIs.`
    ).should('be.visible')
  })

  it('QASE#66_negative_2', function () {
    //visit authorization link with redirect URI https://subdomain1.example.com/subpath
    //expected: user taken to oauth error page
    cy.visit(authorizationLink + 'https://subdomain1.example.com/subpath')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.contains(
      `Redirect URI doesn't match your registered redirect URIs.`
    ).should('be.visible')
  })
  it('QASE#66_negative_3', function () {
    //visit authorization link with redirect URI https://www.example.com
    //expected: user taken to oauth error page
    cy.visit(authorizationLink + 'https://www.example.com')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.contains(
      `Redirect URI doesn't match your registered redirect URIs.`
    ).should('be.visible')
  })
  it('QASE#66_negative_4', function () {
    //visit authorization link with redirect URI
    //expected: user taken to oauth error page https://www.example.com/subpath
    cy.visit(authorizationLink + 'https://www.example.com/subpath')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.contains(
      `Redirect URI doesn't match your registered redirect URIs.`
    ).should('be.visible')
  })

  this.afterEach(() => {})
})
