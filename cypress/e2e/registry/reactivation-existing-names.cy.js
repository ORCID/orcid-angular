// <reference types="cypress" />
import userData from '../../fixtures/testing-users.fixture.json'

/* 
Reactivate your account with a first-name and family-name that already exist on the registry.
Could this be you? modal should not be displayed.
*/

describe('reactivation process for deactivated account', async function () {
  const recordOwner = userData.cyRecordReactivate

  before(() => {})

  it('reactivation process for deactivated account', function () {
    cy.visit('/signin')
    cy.url({ timeout: 40000 }).should('include', Cypress.env('signInURL'))
    cy.signin(recordOwner)
    cy.get('input[formcontrolname="email"]').clear().type(recordOwner.email)
    cy.contains('button', 'SUBMIT').click()

    //use gmail api to check reactivatoin link was sent
    cy.task('checkInbox_from_to_subject', {
      options: {
        from: Cypress.env('reactivationEmailSender'),
        to: recordOwner.email,
        subject: Cypress.env('reactivationEmailSubject'),
        include_body: true,
      },
    }).then((email) => {
      assert.isNotNull(email)
      const emailBody = email.body.html
      //convert string to DOM
      const htmlDom = new DOMParser().parseFromString(emailBody, 'text/html')
      //find the link that points to the correct endpoint
      const href = htmlDom.querySelector(
        `a[href*="https://qa.orcid.org/reactivation/"]`
      ).href
      //follow the link from the email
      cy.visit(href)
    })

    cy.url().should('include', Cypress.env('reactivationEmailLink'))
    cy.get('#given-names-input').clear().type(recordOwner.name)
    cy.get('#family-names-input').clear().type(recordOwner.lastname)
    cy.get('#email-input').should('have.value', recordOwner.email)
    //step to make sure backend validation on the form is complete
    cy.get('app-step-a').within(($appForm) => {
      cy.get('form').should('have.class', 'ng-untouched ng-dirty ng-valid')
    })
    cy.get('#step-a-next-button').click({ force: true })
    //goes right to step b, "is this you?" modal does not exist in the DOM
    cy.get('app-is-this-you').should('not.exist')
    cy.get('#password-input').clear().type(recordOwner.password)
    cy.get('#password-confirm-input').clear().type(recordOwner.password)
    //step to make sure backend validation on the form is complete
    cy.get('app-step-b').within(($appForm) => {
      cy.get('form').should('have.class', 'ng-untouched ng-dirty ng-valid')
    })
    cy.get('#step-b-next').click({ force: true })

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
    //REACTIVATE button
    cy.get('#step-c-register-button').click()
    //user taken my orcid page
    cy.url({ timeout: 40000 }).should('include', '/my-orcid')
   
  })

  after(() => {})
})
