/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*TC#24
pre-condition: user without valid access token
1 - visit authorization link
2 - sign in with ORCID credentials
3 - click button in authorization screen to sign out
4 - sign into another account using ORCID credentials
expected: user is taken to authorization screen
*/

describe('OAuth cypress tests', async function () {
  const scope = '/read-limited'
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=/activities/update%20/person/update&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {})

  it('TC#24 sign out from authorization screen and sign in with different account', function () {
    cy.visit(authorizationLink)
    cy.wait(2000) //need to wait for the redirect to complete
    //sign in
    cy.signin(userData.cyOAuth_RecordOwnerTC21)
    cy.wait(2000) //need to wait for the redirect to complete
    cy.url().then((urlString) => {
      cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
    cy.get('[role=button]').contains('Sign out').click()
    cy.wait(2000) //wait to be redirected
    //sign in with different account
    cy.signin(userData.cyOAuth_RecordOwnerTC31)
    cy.wait(2000) //need to wait for the redirect to complete
    cy.url().then((urlString) => {
      cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
  })

  after(() => {})
})
