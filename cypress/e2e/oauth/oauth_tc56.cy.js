// <reference types="cypress" />
import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#56 - user visits OAuth link with orcid param while signed in (valid token exists)
pre-condition: a given user is signed in
pre-condition: test client has valid token for test user
pre-condition: authorization link contains parameter "orcid=orcid-in-database"
1 - visit authorization link
expected: orcid parameter is ignored
expected: user is taken to redirect_uri with new authorization code (authorization screen is bypassed)
*/

describe('OAuth link with orcid param', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC56

  const authorizationLinkPrecondition =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=/activities/update%20/person/update&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  const authorizationLinkOrcidParam =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=/activities/update%20/person/update&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri +
    '&orcid=' +
    recordOwner.oid

  before(() => {
    //Pre-condition: client has a valid access token for the record
    cy.visit(authorizationLinkPrecondition)
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
      })
    })
  })

  it('TC#56 orcid param is ignored', function () {
    cy.visit(authorizationLinkOrcidParam)
    //Assert user is taken to redirect_uri with new authorization code (authorization screen is bypassed)
    cy.url({ timeout: 4000 }).should(
      'include',
      userData.cyOAuth_MemberUser.redirect_uri + '/?code='
    )
  })

  after(() => {})
})
