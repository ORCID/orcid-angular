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
      return cy
        .wrap(JSON.parse(request.response))
        .its('success')
        .should('be.true')
    }
  })
})
