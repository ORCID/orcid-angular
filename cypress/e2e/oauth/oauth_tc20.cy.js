/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

/*
TC#20
pre-condition: record without valid access token
pre-condition: user is signed in
pre-condition: authorization link includes openid scope + prompt=login parameter
1 - visit authorization link
expected: user is prompted to sign in
2 - sign in with ORCID credentials
expected: user is taken to authorization screen
3 - click button to grant access
expected: user is taken to redirect_uri appended with authorization code
4 - API client exchanges authorization code for access token
expected: 200 API response containing access token
5 - visit authorization link again
expected: user is prompted to sign in
6 - sign in with ORCID credentials
expected: user is taken to redirect_uri appended with authorization code
*/

describe('OAuth cypress tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC20
  //scope includes openid + prompt=login parameter
  const scope = "/read-limited%20/activities/update%20/person/update%20openid&prompt=login"  
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope='+ scope +'&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
    //sign in
    cy.visit(Cypress.env('signInURL'))
    cy.signin(recordOwner)
    cy.wait(2000)//need to wait for the redirect to take effect  
  })

  it('TC#20 Authorization link with openid and prompt params', function () {   
    cy.visit(authorizationLink)
    cy.wait(2000)//need to wait for the redirect to take effect  
    //verify user is prompted to sign in
    cy.signin(recordOwner)
    cy.wait(2000)//need to wait for the redirect to take effect  
    //verify user is taken to authorization link
    cy.url().then((urlString) => {
        cy.url().should('contain', 'qa.orcid.org/oauth/authorize?')
    })
    //click button to grant access
    cy.get('#authorize-button').click()
    cy.wait(2000)

    //expected: user is taken to redirect_uri appended with authorization code
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
            expect(response.stdout).to.contain('HTTP/2 200')
        })
    })

    //visit authorization link again
    cy.visit(authorizationLink)
    cy.wait(2000)//need to wait for the redirect to take effect    
    //user is prompted to sign in with ORCID credentials
    cy.signin(recordOwner)
    cy.wait(2000)
    //verify user is taken to redirect_uri appended with authorization code
    cy.url().then((urlString) => {
        cy.url().should('include', userData.cyOAuth_MemberUser.redirect_uri)
        cy.url().should('include', '?code=')
    }) 
})

  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
