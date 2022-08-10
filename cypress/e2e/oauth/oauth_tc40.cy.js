
/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'

 /*
TC#40 - authorization link customization
pre-condition: authorization link contains name parameters "given_names=Jane" and "family_names=Doe"
1 - visit authorization link
2 - click button to register new account
expected: first name and last name fields should be populated with info from the name parameters in the authorization link
*/ 
describe('OAuth link customization tests', async function () {
  const recordOwner = userData.cyOAuth_RecordOwnerTC_Sessions
  const scope = '/person/update' 
  const testGivenName='Jane'
  const testFamilyName='Doe'
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code'+
    '&scope=' + scope +
    '&given_names='+testGivenName+
    '&family_names='+testFamilyName+
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
  })

  
  it('TC#40 authorization link contains name parameters', function () {
    cy.visit(authorizationLink)
    cy.wait(2000) 
    cy.get('#register-button').click()
    cy.wait(2000) 
    cy.get('#given-names-input').should(($given) => {
      expect($given).to.have.value(testGivenName)
    })
    cy.get('#family-names-input').should(($fam) => {
      expect($fam).to.have.value(testFamilyName)
    })
  })

  after(() => {
  })
})
