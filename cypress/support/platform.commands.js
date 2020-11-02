Cypress.Commands.add('hasNoLayout', () => {
  cy.get('app-header', { timeout: 1 }).should('not.exist')
  cy.get('app-footer', { timeout: 1 }).should('not.exist')
})

Cypress.Commands.add('hasLayout', () => {
  cy.get('app-header')
  cy.get('app-footer')
})

Cypress.Commands.add('hasZendesk', () => {
  cy.get('#launcher')
})

Cypress.Commands.add('hasNoZendesk', () => {
  cy.get('#launcher', { timeout: 1 }).should('not.exist')
})
