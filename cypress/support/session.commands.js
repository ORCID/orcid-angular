/// <reference types="cypress" />

import { environment } from '../cypress.env'

Cypress.Commands.add('sessionLogin', (user) => {
  cy.getCookie('XSRF-TOKEN').then((csrfCookie) => {
    if (!csrfCookie) {
      return cy
        .visit('https://dev.orcid.org/')
        .then(() => cy.sessionLogin(user))
    } else {
      const fd = new FormData()
      const url = environment.baseUrl + '/signin/auth.json'
      const request = new XMLHttpRequest()
      request.open('POST', url, false)
      request.setRequestHeader('X-XSRF-TOKEN', csrfCookie.value)
      request.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded;charset=UTF-8'
      )
      request.send(
        `userId=${encodeURI(environment[user].username)}&password=${
          environment[user].password
        }&oauthRequest=false`
      )
      const response = JSON.parse(request.response)
        .wrap(response)
        .its('success')
        .should('be.true')
    }
  })
})

Cypress.Commands.add('registerUser', (user) => {
  return cy
    .get('#given-names-input')
    .clear()
    .type(user.name)
    .should('have.value', user.name)
    .get('#family-names-input')
    .clear()
    .type(user.familyName)
    .should('have.value', user.familyName)
    .get('#email-input')
    .clear()
    .type(user.email)
    .should('have.value', user.email)
    .get('#confirm-email-input')
    .clear()
    .type(user.email)
    .should('have.value', user.email)
    .get('#step-a-next-button')
    .click()
    .get('#password-input')
    .clear()
    .type(user.password)
    .should('have.value', user.password)
    .get('#password-confirm-input')
    .clear()
    .type(user.password)
    .should('have.value', user.password)
    .get('#step-b-next')
    .click()
    .get('#visibility-everyone-input')
    .click()
    .should('have.class', 'mat-radio-checked')
    .get('#privacy-input input')
    .check({ force: true })
    .should('be.checked')
    .get('#step-c-register-button')
    .click()
    .getIframeBody('iframe')
    .within(() =>
      cy
        .get('.recaptcha-checkbox-border')
        .click()
        .get('#recaptcha-anchor', { timeout: 10000 })
        .should('have.class', 'recaptcha-checkbox-checked')
    )
    .get('#step-c-register-button')
    .click()
    .get('app-register')
    .should('not.exist')
})
