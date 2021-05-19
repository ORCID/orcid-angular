import { environment } from '../cypress.env'

Cypress.Commands.add('expectPreFillSignin', (user) => {
  return cy.get('#username').then((x) => {
    if (user.username) {
      expect(x).have.value(user.username)
    } else {
      expect(x).to.be.empty
    }
  })
})

Cypress.Commands.add('signin', (user) => {
  return cy
    .location()
    .should((loc) => {
      expect(loc.pathname).to.eq('/signin')
    })
    .get('#username')
    .clear()
    .type(user.username || user.email)
    .get('#password')
    .type(user.password)
    .get('#signin-button')
    .click()
})

Cypress.Commands.add('programmaticSignin', (user) => {
  cy.getCookie('XSRF-TOKEN').then((csrfCookie) => {
    if (!csrfCookie) {
      return cy
        .visit(environment.baseUrl)
        .getCookie('XSRF-TOKEN')
        .then(() => cy.programmaticSignin(user))
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
        `userId=${encodeURIComponent(
          environment[user].id || environment[user].email
        )}&password=${environment[user].password}&oauthRequest=false`
      )
      return cy
        .wrap(JSON.parse(request.response))
        .its('success')
        .should('be.true')
    }
  })
})
