/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'
const randomUser = require('../../helpers/randomUser')

/*TC#2
1 - visit authorization link
2 - click button to register new account
3 - complete registration process
expected: user is taken to authorization screen after completing registration process
4 - click button to grant access
result: user is taken to redirect_uri appended with authorization code*/

describe('OAuth cypress tests', async function () {
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=/activities/update%20/person/update&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
    cy.visit(authorizationLink)
  })

  it('TC#2 Authorizing client during registration', function () {
    //Bypass the duplicated research call to avoid getting the "Is this you modal"
    cy.intercept('GET', Cypress.env('duplicatedModalEndPoint'), [])
    cy.get('#register-button').click()

    //generate a new (random) user
    const userToRegister = randomUser()
    //convert email to lower case as gmail uses it this way
    userToRegister.email = userToRegister.email.toLowerCase()

    //verify user is redirected to the register page
    cy.url().should('include', '/register')

    //STEP 1/3 populate form
    cy.get('#given-names-input').clear().type(userToRegister.name)
    cy.get('#family-names-input').clear().type(userToRegister.familyName)
    cy.get('#email-input').clear().type(userToRegister.email)
    cy.get('#confirm-email-input').clear().type(userToRegister.email)
    cy.get('#step-a-next-button').click()

    //STEP 2/3 create OID
    cy.get('.mat-card-title').contains('Create your ORCID iD')
    cy.get('#password-input').clear().type(userToRegister.password)
    cy.get('#password-confirm-input').clear().type(userToRegister.password)
    cy.get('.ng-valid #step-b-next').click()

    //STEP 3/3
    cy.get('#visibility-everyone-input-input').click({ force: true })
    cy.get('#privacy-input-input').check({ force: true }).should('be.checked')
    cy.get('#data-processed-input-input')
      .check({ force: true })
      .should('be.checked')

    //CAPTCHA
    // Wrap iframe body into a cypress object and perform test within there
    cy.getIframeBody('iframe[title="reCAPTCHA"]').within(() => {
      cy.get('.recaptcha-checkbox-border').click()
      cy.get('#recaptcha-anchor', { timeout: 10000 }).should(
        'have.class',
        'recaptcha-checkbox-checked'
      )
    })

    cy.get('#step-c-register-button').click()
    cy.wait(2000) //wait for page to load
    //user taken to auth screen, grant access
    cy.get('#authorize-button').click()
    cy.wait(2000) //wait to be redirected to uri
    cy.url().then((urlString) => {
      cy.url().should('include', userData.cyOAuth_MemberUser.redirect_uri)
      //verify url has appended authorization code
      const codeToExchange = urlString.split('=')[1]
      cy.log('codeToExchange: ' + codeToExchange)
      expect(codeToExchange).to.not.be.undefined
    })
  })

  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
