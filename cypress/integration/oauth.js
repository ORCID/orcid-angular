/// <reference types="cypress" />


describe('The Dashboard Page', () => {
  beforeEach(() => {})

  it('logs in programmatically without using the UI', function () {
    cy.sessionLogin('testUser')
    cy.visit('https://dev.orcid.org/signin')
  })
})
