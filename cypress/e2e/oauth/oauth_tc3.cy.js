/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#3
1 - visit authorization link
2 - navigate to signin page in the browser
3 - sign in with ORCID credentials
result: user is taken to my-orcid and not to authorization screen
 */

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwner1
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=/activities/update%20/person/update&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
    cy.visit(authorizationLink)
  })

  it('TC#3 Navigating to sign in instead of signing in from auth link', function () {
    cy.url().then((urlString) => {
      cy.url().should('eq', authorizationLink)
    })

    //navigate directly to sign in page
    cy.visit(Cypress.env('signInURL'))
    cy.wait(2000)

    cy.get('#username').clear().type(recordOwner.oid)
    cy.get('#password').clear().type(recordOwner.password)
    cy.get('#signin-button').click()
    cy.wait(2000)

    //verify user taken to my orcid instead of authorization screen
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
