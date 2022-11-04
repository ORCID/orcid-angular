/// <reference types="cypress" />

import userData from '../../fixtures/openID_users.fixture.json'

/* TC#6
- visit authorization link
- sign in with ORCID credentials
- click button to grant access
- exchange authorization code for access token

expected:
- OAuth request returns authorization code as query parameter
- server response when exchanging authorization code contains access token as well as id_token
*/

describe('openID test cases', async function () {
  const recordOwner = userData.cyOpenID_RecordOwner6
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOpenID_client1.clientID +
    '&response_type=code&scope=openid&redirect_uri=' +
    userData.cyOpenID_client1.redirect_uri

  before(() => {})

  it('TC#6 - authorization link with openid scope + response_type "code"', function () {
    cy.visit(authorizationLink)
    cy.signin(recordOwner)
    //grant access
    cy.get('#authorize-button').click({ timeout: 4000 })
    cy.wait(2000)
    cy.url().then((urlString) => {
      //grab appended code and exchange it for token
      const codeToExchange = urlString.split('=')[1]
      cy.log('codeToExchange: ' + codeToExchange)

      const curlGetAccessToken =
        "curl -i -L -H 'Accept: application/json' --data 'client_id=" +
        userData.cyOpenID_client1.clientID +
        '&client_secret=' +
        userData.cyOpenID_client1.clientSecret +
        '&grant_type=authorization_code&code=' +
        codeToExchange +
        "' 'https://qa.orcid.org/oauth/token'"

      cy.log(curlGetAccessToken)
      cy.exec(curlGetAccessToken).then((response) => {
        expect(response.stdout).to.contain('HTTP/2 200')
        expect(response.stdout).to.contain('access_token')
        expect(response.stdout).to.contain('id_token')
      })
    })
  })

  after(() => {})
})
