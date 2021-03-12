Cypress.Commands.add('hasNoLayout', () => {
  return cy
    .get('app-header', { timeout: 1 })
    .should('not.exist')
    .get('app-footer', { timeout: 1 })
    .should('not.exist')
})

Cypress.Commands.add('hasLayout', () => {
  return cy.get('app-header').get('app-footer')
})

Cypress.Commands.add('hasZendesk', () => {
  cy.get('#launcher')
})

Cypress.Commands.add('hasNoZendesk', () => {
  return cy.get('#launcher', { timeout: 1 }).should('not.be.visible')
})
