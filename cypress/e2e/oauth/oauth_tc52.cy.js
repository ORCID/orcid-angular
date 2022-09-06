// <reference types="cypress" />
import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#52 - authorization link customization
pre-condition: authorization link contains parameters "orcid=orcid-not-in-database" + "given_names=Jane" + "family_names=Doe"
1 - visit authorization link
expected: user is taken to registration screen as part of OAuth
expected: registration screen is populated with given name and family name
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
    '&given_names=Jane' +
    '&family_names=Doe' +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {})

  it('TC#52 authorization link contains a not existing orcid id param also given and family names params', function () {
    cy.visit(authorizationLink)
    cy.wait(2000)
    cy.url().should('include', Cypress.env('registrationPage'))
    cy.get('#given-names-input').should('have.value', 'Jane')
    cy.get('#family-names-input').should('have.value', 'Doe')
  })

  after(() => {})
})
