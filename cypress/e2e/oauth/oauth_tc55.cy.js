// <reference types="cypress" />
import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#55 - exchange refresh token for new access token
pre-condition: client has a valid access token and respective refresh token
1 - API client calls /oauth/token endpoint to exchange refresh token for new access token
expected: API response HTTP/1.1 200 OK
expected: API response body contains new access token
*/

describe('OAuth client refreshes access token', async function () {
  var newAccessToken
  var refreshToken
  const recordOwner = userData.cyOAuth_RecordOwnerTC55

  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=/activities/update%20/person/update&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
    //Pre-condition: client has a valid access token
    cy.visit(authorizationLink)
    cy.signin(recordOwner)
    //grant access to get code
    cy.get('#authorize-button', { timeout: 4000 }).click()
    cy.url({ timeout: 4000 }).should(
      'include',
      userData.cyOAuth_MemberUser.redirect_uri + '/?code='
    )
    cy.url().then((urlString) => {
      //grab appended code and exchange it for a valid access token
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
        cy.log(responseStr)
        //verify response is OK
        expect(responseStr).to.contain('HTTP/2 200')
        //get refresh token
        const strStart = 'refresh_token":"'
        const strEnd = '","expires_in"'
        const posStart = responseStr.lastIndexOf(strStart) + strStart.length
        const posEnd = responseStr.indexOf(strEnd)
        refreshToken = responseStr.slice(posStart, posEnd)
        cy.log('refresh Token: ' + refreshToken)
      })
    })
  })

  it('TC#55 client exchanges refresh token for a new access token', function () {
    //use refresh token to get a new access token
    const curlGetNewToken = 
    "curl -d 'refresh_token="+ refreshToken +"'"+
    " -d 'grant_type=refresh_token' -d 'client_id="+ userData.cyOAuth_MemberUser.clientID +"'"+
    " -d 'client_secret=" + userData.cyOAuth_MemberUser.clientSecret + "'"+
    " -d 'revoke_old=true' https://api.qa.orcid.org/oauth/token"
    
    cy.exec(curlGetNewToken).then((response) => {
      const responseStr = response.stdout
      cy.log(responseStr)
      //verify response returns a new access code
      expect(responseStr).to.contain('access_token')
      //get access token
      const strStart = 'access_token":"'
      const strEnd = '","token_type"'
      const posStart = responseStr.lastIndexOf(strStart) + strStart.length
      const posEnd = responseStr.indexOf(strEnd)
      newAccessToken = responseStr.slice(posStart, posEnd)
      cy.log('new access Token: ' + newAccessToken)

      //Try to use new access token
      const curlPostWork =
        "curl -i -H 'Content-type: application/json' -H " +
        "'Authorization: Bearer " +
        newAccessToken +"' -d '" +
       recordOwner.curlPostWorkPath +
        "' -X POST 'https://api.qa.orcid.org/v3.0/" +
        recordOwner.oid +
        "/work'"
      cy.log(curlPostWork)

      cy.exec(curlPostWork).then((response) => {
        const responseStr = response.stdout
        //verify response is succesful
        expect(responseStr).to.contain('HTTP/2 201')
      })
    })
  })

  after(() => {})
})