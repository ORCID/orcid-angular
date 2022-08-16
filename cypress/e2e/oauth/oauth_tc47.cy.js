
/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

 /*
TC#47 - authorization link customization
pre-condition: authorization link contains parameters "email=email-in-database" + "show_login=false"
1 - visit authorization link
expected: email parameter takes precedence over show_login parameter, therefore user is taken to signin screen as part of OAuth session
 */ 

 describe('OAuth link customization tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = '/person/update' 
  const emailParamValue = userData.cyOAuth_RecordOwnerTC_Sessions.email
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code'+
    '&scope=' + scope +
    '&email='+ emailParamValue +
    '&show_login=false'+
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
  })

  it('TC#47 authorization link contains email parameter  + show_login=false', function () {
    cy.visit(authorizationLink)
    cy.wait(2000) 
    cy.url().should('include', Cypress.env('signInURL'))
   cy.get('#username').should('have.value',emailParamValue)
  })

  after(() => {
  })
})
