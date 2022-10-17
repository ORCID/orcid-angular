// <reference types="cypress" />
import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#57 - user visits OAuth link with orcid param while signed in (no valid token)
pre-condition: a given user is signed in
pre-condition: test client does not have a valid token for test user
pre-condition: authorization link contains parameter "orcid=orcid-in-database"
1 - visit authorization link
expected: orcid param is ignored
expected: user is taken to authorization screen
*/

describe('OAuth link with orcid param', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC57

  const authorizationLinkOrcidParam =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=/activities/update%20/person/update&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri +
    '&orcid=' +
    recordOwner.oid

  before(() => {
    cy.visit(Cypress.env('signInURL'))
    //Pre-condition: record owner is signed in
    cy.signin(recordOwner)
    cy.wait(2000)
  })

  it('TC#57 OAuth link with orcid param while signed in (no valid token)', function () {
    cy.visit(authorizationLinkOrcidParam)
    //verify user taken to authorization screen
    cy.get('#authorize-button').should('be.visible')
  })

  after(() => {})
})
