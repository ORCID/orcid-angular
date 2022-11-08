// <reference types="cypress" />
import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC# 53 - client revokes access token
pre-condition: client has a valid access token for any given record
1 - API client calls /oauth/revoke endpoint to revoke access token
expected: API response HTTP/1.1 200 OK
*/

describe('OAuth client revokes access token', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC53

  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=/activities/update%20/person/update&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  var token2revoke //valid access token

  before(() => {
    //Pre-condition: client has a valid access token
    cy.visit(authorizationLink)
    cy.get('#username').clear().type(recordOwner.oid)
    cy.get('#password').clear().type(recordOwner.password)
    cy.get('#signin-button').click()

    //grant access to get code
    cy.get('#authorize-button', { timeout: 4000 }).click()
    cy.url({ timeout: 4000 }).should(
      'include',
      userData.cyOAuth_MemberUser.redirect_uri + '/?code='
    )
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
      cy.exec(curlGetAccessToken).then((response) => {
        const responseStr = response.stdout
        //verify response is OK
        expect(responseStr).to.contain('HTTP/2 200')
        //get access token
        const strStart = 'access_token":"'
        const strEnd = '","token_type"'
        const posStart = responseStr.lastIndexOf(strStart) + strStart.length
        const posEnd = responseStr.indexOf(strEnd)
        token2revoke = responseStr.slice(posStart, posEnd)
        cy.log('tokenGenerated: ' + token2revoke)
      })
    })
  })

  it('TC#53 & TC#54 client revokes access token which cannot be used to make changes to record', function () {
    //TC#53 Revoke access token
    const curlRevokeToken =
      "curl -i -L -H 'Accept: application/json' --data 'client_id=" +
      userData.cyOAuth_MemberUser.clientID +
      '&client_secret=' +
      userData.cyOAuth_MemberUser.clientSecret +
      '&token=' +
      token2revoke +
      "' '" +
      Cypress.env('membersAPI_revokeTokenEndPoint') +
      "'"
    cy.log(curlRevokeToken)
    //execute and verify response is OK
    cy.exec(curlRevokeToken).then((response) => {
      expect(response.stdout).to.contain('HTTP/2 200')
    })

    //TC#54 Try to use revoked token
    const curlPostWork =
      "curl -i -H 'Content-type: application/json' -H " +
      "'Authorization: Bearer " +
      token2revoke +
      "' -d '" +
      recordOwner.curlPostWorkPath +
      "' -X POST 'https://api.qa.orcid.org/v3.0/" +
      recordOwner.oid +
      "/work'"
    cy.log(curlPostWork)

    cy.exec(curlPostWork).then((response) => {
      const responseStr = response.stdout
      //verify error message indicates token is invalid
      expect(responseStr).to.contain('"error" : "invalid_token"')
    })
  })

  after(() => {})
})
