
/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#32 - deny access
1 - visit authorization link
2 - sign in with ORCID credentials
expected: user is taken to authorization screen
3 - click button to deny access
expected: user is taken to redirect URI appended with "?error=access_denied&error_description=User%20denied%20access"
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

  before(() => {
  })

  it('TC#32 OAuth session must end once user denies permission', function () {
    cy.visit(authorizationLink)
    cy.wait(2000) 
    cy.signin(recordOwner)
    cy.url().then((urlString) => {
        cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
      })
    cy.get('#deny-button').click()
    cy.url().then((urlString) => {
        cy.url().should('include', '?error=access_denied&error_description=User%20denied%20access')
    })
  })

  after(() => {
  })
})
