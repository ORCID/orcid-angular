Cypress.Commands.add('expectPreFillSignin', (user) => {
  return cy.get('#username').then((x) => {
    if (user.username) {
      expect(x).have.value(user.username)
    } else {
      expect(x).to.be.empty
    }
  })
})
