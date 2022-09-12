// <reference types="cypress" />
import { type } from 'os'
import userData from '../../fixtures/oauth-users.fixture.json'

/* TC#16
pre-condition: deactivated account
1 - visit authorization link
2 - sign in with deactivated account
3 - click button to send reactivation link
4 - visit reactivation link
5 - complete form to reactivate account
expected: user is taken to authorization screen after completing reactivation process
6 - click button to grant access */

describe('OAuth deactivation test case', async function () {
  const scope = '/person/update'
  const recordOwner = userData.cyOAuth_RecordDeactivate

  const authorizationLink =
    'https://qa.orcid.org/oauth/authorize?client_id=' +
    userData.cyOAuth_MemberUser.clientID +
    '&response_type=code' +
    '&scope=' +
    scope +
    '&redirect_uri=' +
    userData.cyOAuth_MemberUser.redirect_uri

  before(() => {})

  it('TC#16 deactivated record', function () {
    cy.visit(authorizationLink)
    cy.url({ timeout: 20000 }).should('include', Cypress.env('signInURL'))
    cy.get('#username').clear().type(recordOwner.oid)
    cy.get('#password').clear().type(recordOwner.password)
    cy.get('#signin-button', { timeout: 20000 }).click()
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
    cy.get('#email-input').should('have.value', recordOwner.email)
    //step to make sure backend validation on the form is complete
    cy.get('app-step-a').within(($appForm) => {
      cy.get('form').should('have.class', 'ng-untouched ng-dirty ng-valid')
    })
    cy.get('#step-a-next-button').click({ force: true })
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
    //user taken to auth screen, grant access
    cy.get('#authorize-button', { timeout: 20000 }).click()
    cy.url().should(
      'include',
      userData.cyOAuth_MemberUser.redirect_uri + '/?code='
    )
  })

  after(() => {})
})
