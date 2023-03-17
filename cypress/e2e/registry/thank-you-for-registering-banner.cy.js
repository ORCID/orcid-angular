/// <reference types="cypress" />
const randomUser = require('../../helpers/randomUser')
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Register new user - a Thank you banner is displayed - verify email sent', async function () {
  const welcomeMessage = 'Thank you for registering with ORCID'
  const emailVerifRemidnerMessage = 'Please verify your primary email address!'
  
  beforeEach(() => {
    cy.visit('/')
  })

  qase(
    ['105'],
  it('Register new user - a Thank you banner is displayed - verify email sent', function () {
    //Bypass the duplicated research call to avoid getting the "Is this you modal"
    cy.intercept('GET', Cypress.env('duplicatedModalEndPoint'), [])

    //generate a new (random) user
    const userToRegister = randomUser()
    //convert email to lower case as gmail uses it this way
    userToRegister.email = userToRegister.email.toLowerCase()

    cy.get('#menu-signin-button').click()
    //verify user is redirected to the sign in page
    cy.url().should('include', '/signin')
    cy.get('#register-button').click()
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

    //verify top banner
    cy.contains('app-top-bar-verification-email', welcomeMessage).should('be.visible')
    cy.wait(4000)//wait for back end so button is clickable
    cy.contains('button','Resend verification email').click({force:true})
    cy.wait(4000)//wait for banner to dinamically update message
    cy.contains('app-top-bar-verification-email', emailVerifRemidnerMessage).should('be.visible')

    //use Gmail API to check verification email was sent
    //this task will poll the inbox every 15sec to check for the email
    cy.task('checkInbox_from_to_subject', {
      options: {
        from: Cypress.env('senderVerifyEmail'),
        to: userToRegister.email,
        subject: Cypress.env('verifyEmailReminderSubject'),
        include_body: true,
      },
    }).then((email) => {
      assert.isNotNull(email)
      const emailBody = email.body.html
      cy.log('>>>>>>>>>Email body is: ' + JSON.stringify(email.body))

      //convert string to DOM
      const htmlDom = new DOMParser().parseFromString(emailBody, 'text/html')
      cy.log(htmlDom.documentElement.innerHTML)
      //find the link
      const href = htmlDom.querySelector('[id$="verificationButton"]').href
      cy.log('>>>>>>>found the link: ' + href)

      // make an api request for this resource (no UI needed)
      // drill into the response to check it was successful
      cy.request(href).its('status').should('eq', 200)
    })

    //reload page
    cy.reload()
    cy.wait(4000)
    //try editing Bio which only users with verified emails can do
    cy.get('#biography-panel').within(($bioSection) => {
      cy.get('.cy-edit-button').click()
    })
    cy.get('#biography-input')
      .clear()
      .type('only users with verified emails can edit bio')
    cy.get('#save-biography-button').click()
    cy.get('#biography').contains(
      'only users with verified emails can edit bio'
    )

    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
  ) //end of qase tag
})
