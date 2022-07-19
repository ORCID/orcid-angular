/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/* TC#27
1 - visit authorization link
2 - sign in with ORCID credentials
expected: user is taken to authorization screen
3 - click button to deny access
expected: user is taken to redirect URI appended with "?error=access_denied&error_description=User%20denied%20access"
4 - navigate to https://qa.orcid.org/signout
expected: user is taken to signin page
5 - sign in with ORCID credentials
expected: user is taken to my orcid page
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

  it('TC#27 OAuth session must end once user denies access', function () {
    cy.visit(authorizationLink)
    cy.signin(recordOwner)
    cy.wait(2000) //need to wait for the redirect to complete
    cy.url().then((urlString) => {
      cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
    cy.get('#deny-button').click()
    cy.wait(2000) //wait to be redirected
    //verify user is taken to redirect_uri with appended authorization code
    cy.url().then((urlString) => {
      cy.url().should(
        'include',
        '?error=access_denied&error_description=User%20denied%20access'
      )
    })
    cy.visit('https://qa.orcid.org/signout')
    //verify user is redirected to Sign in page
    cy.url().should('contain', Cypress.env('signInURL'))
    cy.signin(recordOwner)
    cy.wait(2000) //need to wait for the redirect to complete
    //verify user taken to my orcid
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
