/// <reference types="cypress" />

import userData from '../../fixtures/openID_users.fixture.json'
import jwtDecode from 'jwt-decode'
/* 
TC#3
Precondition:
 authorization link with openid scope + response_type "id_token token" + nonce parameter
Steps:
- visit authorization link
- sign in with ORCID credentials
- click button to grant access
expected:
- OAuth request returns short-lived access token (10 minutes)
- OAuth request returns id_token
- response_type "token" generates an implicit OAuth response
- implicit OAuth response uses URL fragments not query parameters (i.e. # not ?)
*/

describe('openID test cases', async function () {
  const recordOwner = userData.cyOpenID_RecordOwner2
  const nonceString = recordOwner.nonceParam
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOpenID_client1.clientID +
    '&nonce=' +
    nonceString +
    '&response_type=token id_token&scope=openid&redirect_uri=' +
    userData.cyOpenID_client1.redirect_uri

  before(() => {})

  it('TC#3 - authorization link with openid scope + response_type "token id_token" + nonce parameter', function () {
    cy.visit(authorizationLink)
    cy.signin(recordOwner)
    //grant access
    cy.get('#authorize-button').click({ timeout: 4000 })
    cy.wait(2000) //must wait for redirect to complete
    cy.url().then((urlString) => {
      expect(urlString).to.include('#access_token=')
      expect(urlString).to.include('id_token=')
      const token2Decode = urlString.split('id_token=')[1]
      const decoded = jwtDecode(token2Decode) // Returns with the JwtPayload type
      expect(decoded.nonce).to.eq(nonceString)
    })
  })

  after(() => {})
})
