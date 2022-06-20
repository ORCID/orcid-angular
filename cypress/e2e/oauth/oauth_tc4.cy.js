/// <reference types="cypress" />

import userData from '../../fixtures/oauth-users.fixture.json'
const randomUser = require('../../helpers/randomUser')

/*
TC#4
1 - visit authorization link
2 - navigate to register page in the browser
3 - complete registration process
result: user is taken to my-orcid and not to authorization screen
*/

describe('OAuth cypress tests', async function () {
  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code&scope=/activities/update%20/person/update&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {
    cy.visit(authorizationLink)
  })

  it('TC#4 Navigating to registration instead of registering from auth link', function () {
    //navigate directly to registration page
    cy.visit(Cypress.env('registrationPage'))

    //Bypass the duplicated research call to avoid getting the "Is this you modal"
    cy.intercept('GET', Cypress.env('duplicatedModalEndPoint'), [])

    //verify user is redirected to the register page
    cy.url().should('include', '/register')

    //generate a new (random) user
    const userToRegister = randomUser()
    //convert email to lower case as gmail uses it this way
    userToRegister.email = userToRegister.email.toLowerCase()

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
    //verify user taken to my orcid instead of authorization screen
    cy.url().then((urlString) => {
      cy.url().should('include', 'my-orcid?orcid=')
    })
  })

  after(() => {})
})
