/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#19
pre-condition: record with valid access token
pre-condition: authorization link includes scopes not yet authorized
1 - visit authorization link
2 - sign in with ORCID credentials
expected: user is taken to authorization link
4 - click button to grant access
result: user is taken to redirect_uri appended with authorization code
*/

describe('OAuth cypress tests', async function () {

  const recordOwner = userData.cyOAuth_RecordOwnerTC19
  const scope = "/read-limited%20/person/update" //does NOT match authorized scopes in fixture file
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope='+ scope +'&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
    cy.visit(authorizationLink)
  })

  it('TC#19 Client signs in with not authorized scopes', function () {
    cy.get('#username').clear().type(recordOwner.oid)
    cy.get('#password').clear().type(recordOwner.password)
    cy.get('#signin-button').click()
    cy.wait(3000)//need to wait for the redirect to take effect  
    //user is taken to authorization link
    cy.url().then((urlString) => {
        cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
   //click button to grant access
   cy.get('#authorize-button').click()
   cy.wait(2000)
    //verify user is taken to redirect_uri with appended authorization code
    cy.url().then((urlString) => {
      cy.url().should('include', userData.cyOAuth_MemberUser.redirect_uri)
      cy.url().should('include', '?code=')
    })
  })

  after(() => {})
})
