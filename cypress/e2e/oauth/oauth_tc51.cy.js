// <reference types="cypress" />
import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#51 - authorization link customization
pre-condition: authorization link contains parameter "orcid=orcid-not-in-database"
1 - visit authorization link
expected: user is taken to registration screen as part of OAuth session
*/

describe('OAuth link customization tests', async function () {
  const scope = '/person/update'
  const orcidParamValue = 'AAAA-BBBB-CCCC-DDDD'

  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code' +
    '&scope=' +
    scope +
    '&orcid=' +
    orcidParamValue +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {})

  it('TC#51 authorization link contains a not existing orcid id param', function () {
    cy.visit(authorizationLink)
    cy.wait(2000)
    cy.url().should('include', Cypress.env('registrationPage'))
  })

  after(() => {})
})
