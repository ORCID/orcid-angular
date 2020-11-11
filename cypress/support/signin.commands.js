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
