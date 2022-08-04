/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/* TC#29
1 - visit authorization link
2 - sign in with ORCID credentials
expected: user is taken to authorization screen
navigate to https://qa.orcid.org/my-orcid
3 - sign out
5 - sign in with ORCID credentials
expected: user is taken to my-orcid page
expected: OAuth session must not be revived at this stage
*/

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = '/person/update'
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=' +
    scope +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {})

  it('TC#29 OAuth session must end once user moves away from the session', function () {
    cy.visit(authorizationLink)
    cy.wait(2000)
    cy.signin(recordOwner)
    cy.url().then((urlString) => {
      cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
    //navigate directly to sign in page
    cy.visit('https://qa.orcid.org/my-orcid')
    cy.wait(2000)
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
    cy.wait(2000) //need to wait for the session to close
    cy.signin(recordOwner)
    cy.wait(2000)
    cy.url().then((urlString) => {
      cy.url().should('include', 'my-orcid?orcid=')
    })
  })

  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
