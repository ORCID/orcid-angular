// <reference types="cypress" />
import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#50 - authorization link customization
pre-condition: authorization link contains parameter "orcid=orcid-in-database"
1 - visit authorization link
expected: user is taken to signin screen as part of OAuth session and username field is populated with ORCID iD from orcid parameter
*/

describe('OAuth link customization tests', async function () {
  const scope = '/person/update'
  const orcidParamValue = userData.cyOAuth_RecordOwner1.oid

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

  it('TC#50 authorization link contains valid orcid id param', function () {
    cy.visit(authorizationLink)
    cy.wait(2000)
    cy.url().should('include', Cypress.env('signInURL'))
    cy.get('#username').should('have.value', orcidParamValue)
  })

  after(() => {})
})
