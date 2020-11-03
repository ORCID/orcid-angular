Cypress.Commands.add('expectAuthorizeScreen', (authorize) => {
  return cy
    .get('app-form-authorize')
    .get('#user-name')
    .contains(authorize.displayName)
    .get('#app-name')
    .contains(authorize.appName)
    .then(() => {
      authorize.scopes.forEach((scope) => {
        cy.get('li#openid')
      })
    })
    .get('li')
    .should('have.length', authorize.scopes.length)
})
