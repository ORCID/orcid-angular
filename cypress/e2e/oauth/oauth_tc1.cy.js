/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/* TC#1
pre-condition: record without valid access token
1 - visit authorization link
2 - sign in with ORCID credentials
3 - click button to grant access
result: user is taken to redirect_uri appended with authorization code
4 - API client exchanges authorization code for access token
expected: 200 API response containing access token */

describe('OAuth cypress tests - TC#1', async function () {
  const recordOwner = userData.cyOAuth_RecordOwner1
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=/activities/update%20/person/update&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
    cy.visit(authorizationLink)
  })

  it('TC#1 Client is able to exchange authorization code for access code', function () {
    cy.get('#username').clear().type(recordOwner.oid)
    cy.get('#password').clear().type(recordOwner.password)
    cy.get('#signin-button').click()
    cy.wait(2000)

    //grant access
    cy.get('#authorize-button').click()
    cy.wait(2000)
    cy.url().should('include', userData.cyOAuth_MemberUser.redirect_uri)

    cy.url().then((urlString) => {
      //grab appended code and exchange it for token
      const codeToExchange = urlString.split('=')[1]
      cy.log('codeToExchange: ' + codeToExchange)

      const curlGetAccessToken =
        "curl -i -L -H 'Accept: application/json' --data 'client_id=" +
        userData.cyOAuth_MemberUser.clientID +
        '&client_secret=' +
        userData.cyOAuth_MemberUser.clientSecret +
        '&grant_type=authorization_code&code=' +
        codeToExchange +
        "' 'https://qa.orcid.org/oauth/token'"

      cy.log(curlGetAccessToken)
      cy.exec(curlGetAccessToken).then((response) => {
        expect(response.stdout).to.contain('HTTP/2 200')
      })
    })
  })

  after(() => {})
})
