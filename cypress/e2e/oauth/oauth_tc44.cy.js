
/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

 /*
TC#44 - authorization link customization
pre-condition: authorization link contains parameter "lang="
1 - visit authorization link
expected: user is taken to signin screen as part of OAuth session in the language defined in the lang parameter
 */ 

 describe('OAuth link customization tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = '/person/update' 
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code'+
    '&scope=' + scope +
    '&lang=ES'+ 
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
  })

  it('TC#44 authorization link contains language parameter', function () {
    cy.visit(authorizationLink)
    cy.wait(2000) 
    cy.url().should('include', Cypress.env('signInURL'))
    //testing page is displayed in language selected
    cy.get('#signin-button').should('have.text','INICIAR SESIÓN')
  })

  after(() => {
  })
})
