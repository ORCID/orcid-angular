/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#30 
pre-condition: client id with registered redirect URI 
containing trailing whitespace e.g. ``https://example.com ``
*/

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC30
  const scope = '/read-limited'
  //NOTE: partial auth link to append different uris
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberTC30.clientID +
    '&response_type=code&scope=' +
    scope +
    '&redirect_uri='

  before(() => {
    //sign in
    cy.visit(Cypress.env('signInURL'))
    cy.signin(recordOwner)
    cy.wait(2000) //need to wait for the redirect to take effect
  })

  it('TC#30 Registered redirect uri contains trailing whitespaces', function () {
    //1 - visit authorization link with redirect URI "https://example.com"
    //expected: user taken to authorization screen
    cy.visit(authorizationLink + 'https://www.example.com')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.url().then((urlString) => {
      cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
    //2 - visit authorization link with redirect URI "https://subdomain1.example.com"
    //expected: user taken to authorization screen
    cy.visit(authorizationLink + 'https://subdomain1.example.com')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.url().then((urlString) => {
      cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
    //3 - visit authorization link with redirect URI "https://subdomain1.example.com/subpath"
    cy.visit(authorizationLink + 'https://subdomain1.example.com/subpath')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.url().then((urlString) => {
      cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
    //4 - visit authorization link with redirect URI "https://example.com"
    // expected: user taken to authorization screen
    cy.visit(authorizationLink + 'https://example.com')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.url().then((urlString) => {
      cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
    //5 - visit authorization link with redirect URI "https://example.com/subpath"
    // expected: user taken to authorization screen
    cy.visit(authorizationLink + 'https://example.com/subpath')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.url().then((urlString) => {
      cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
    //6 - visit authorization link with redirect URI "https://www.example.com/subpath"
    // expected: user taken to authorization screen
    cy.visit(authorizationLink + 'https://www.example.com/subpath')
    cy.wait(2000) //need to wait for the redirect to take effect
    cy.url().then((urlString) => {
      cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
  })

  after(() => {})
})
