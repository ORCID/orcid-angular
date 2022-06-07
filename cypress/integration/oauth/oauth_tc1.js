/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'

/* TC#1
pre-condition: record without valid access token
1 - visit authorization link
2 - sign in with ORCID credentials
3 - click button to grant access
result: user is taken to redirect_uri appended with authorization code
4 - API client exchanges authorization code for access token
expected: 200 API response containing access token */

describe('OAuth cypress tests', async function () {

    const clientAPP= userData.cyUserMemmerAPI  
    const recordOwner=userData.cyAcctSettVisibilityUser
    const authorizationLink= "https://qa.orcid.org/oauth/authorize?client_id="+clientAPP.clientID+"&response_type=code&scope=/activities/update%20/person/update&redirect_uri=https://developers.google.com/oauthplayground"

  before(() => {})
  it.skip('Client is able to exchange authorization code for access code', function () {
    cy.log("hola")
    console.log("hola")
    //visit
    cy.visit(authorizationLink)
    cy.get('#username').clear().type(recordOwner.oid)
    cy.get('#password').clear().type(recordOwner.password)
    cy.get('#signin-button').click()
   
    //grant access
    cy.get('#authorize-button').click()
    cy.get(location).should((loc) => {
        expect(loc.pathname).to.contain('https://developers.google.com/oauthplayground/?code=')
    })
    const redirect_uri=location.pathname
    const codeToExchange= redirect_uri.split('=')[1]
   cy.log("redirect_uri: "+redirect_uri)
    cy.log("codeToExchange: "+codeToExchange)
   

/*
    const curlGetAccessToken =
    "curl -i -L -H 'Accept: application/json' --data 'client_id=" +
    clientAPP.clientID +
    "&client_secret=" +
    clientAPP.clientSecret+
    "&grant_type=authorization_code&code=" +
    codeToExchange +
    "' 'https://qa.orcid.org/oauth/token'"

    cy.log(curlGetAccessToken)
    cy.exec(curlGetAccessToken).then((response) => {
        expect(response.code).to.eq(200)
    })
*/
  })

  it('TC#5 user is taken to institutional account linking page', function () {
    cy.log("hola")
    console.log("hola")
    //visit
    cy.visit(authorizationLink)
    cy.get('#access-through-your-institution-button').click()
    cy.get('input[aria-label="Institution"]').type("SAMLtest IdP") //REPLACE ID
    cy.wait(4000)
    cy.get('button[type="submit"]').click()//REPLACE ID
   // cy.get('#username').clear().type(recordOwner.oid)
   // cy.get('#password').clear().type(recordOwner.password)
   // cy.get('#signin-button').click()
   
    //grant access
   // cy.get('#authorize-button').click()
   // cy.get(location).should((loc) => {
   //     expect(loc.pathname).to.contain('https://developers.google.com/oauthplayground/?code=')
   // })
  //  const redirect_uri=location.pathname
  //  const codeToExchange= redirect_uri.split('=')[1]
  // cy.log("redirect_uri: "+redirect_uri)
  //  cy.log("codeToExchange: "+codeToExchange)
   

/*
    const curlGetAccessToken =
    "curl -i -L -H 'Accept: application/json' --data 'client_id=" +
    clientAPP.clientID +
    "&client_secret=" +
    clientAPP.clientSecret+
    "&grant_type=authorization_code&code=" +
    codeToExchange +
    "' 'https://qa.orcid.org/oauth/token'"

    cy.log(curlGetAccessToken)
    cy.exec(curlGetAccessToken).then((response) => {
        expect(response.code).to.eq(200)
    })
*/
  })
    //exchange code for access token
    //curl -i -L -H 'Accept: application/json' --data 'client_id=APP-6RTM54FDADENEKUK&client_secret=95533ab6-3594-40a7-98b8-c8db637f2514&grant_type=authorization_code&code=uiJUg0' 'https://qa.orcid.org/oauth/token'
})
