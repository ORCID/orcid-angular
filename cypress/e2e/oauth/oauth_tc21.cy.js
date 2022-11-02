/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#21 - replaced by Qase #63 and #65
pre-condition: client ID with registered redirect URI "https://example.com"
pre-condition: user without valid access token
pre-condition: user is signed in
*/

describe('Redirect URI validation', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC21
  const scope = '/read-limited'
  //NOTE: partial auth link to append different uris
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=' +
    scope +
    '&redirect_uri='

    beforeEach(() => {
      //sign in
      cy.visit(Cypress.env('signInURL'))
      cy.signin(recordOwner)
      cy.wait(2000) //need to wait for the redirect to take effect
    })
  
  it('QASE#63_positive_1', function () {
    //visit authorization link with redirect URI https://example.com
    //expected: user taken to authorization screen
    cy.visit(authorizationLink + 'https://example.com')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    cy.get('#authorize-button').should('be.visible')
  })

  it('QASE#63_positive_2', function () {
    //visit authorization link with redirect URI https://example.com/subpath
    //expected: user taken to authorization screen
    cy.visit(authorizationLink + 'https://example.com/subpath')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    cy.get('#authorize-button').should('be.visible')
  })

  it('QASE#65_negative_1', function () {
    //visit authorization link with redirect URI https://www.example.com
    //expected: user taken to oauth error page
    cy.visit(authorizationLink + 'https://www.example.com')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.contains(`Redirect URI doesn't match your registered redirect URIs.`).should('be.visible')
  }) 

  it('QASE#65_negative_2', function () {
    //visit authorization link with redirect URI https://subdomain1.example.com
    //expected: user taken to oauth error page
    cy.visit(authorizationLink + 'https://subdomain1.example.com')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.contains(`Redirect URI doesn't match your registered redirect URIs.`).should('be.visible')
  }) 

  it('QASE#65_negative_3', function () {
    //visit authorization link with redirect URI https://subdomain1.example.com/subpath
    //expected: user taken to oauth error page
    cy.visit(authorizationLink + 'https://subdomain1.example.com/subpath')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.contains(`Redirect URI doesn't match your registered redirect URIs.`).should('be.visible')
  }) 
 
  it('QASE#65_negative_4', function () {
    //visit authorization link with redirect URI https://www.example.com/subpath
    //expected: user taken to oauth error page
    cy.visit(authorizationLink + 'https://www.example.com/subpath')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.contains(`Redirect URI doesn't match your registered redirect URIs.`).should('be.visible')
  }) 

  this.afterEach(() => {
  })
})
