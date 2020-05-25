context('verification', () => {
  it('Access https://qa.orcid.org/, locate and click the "SIGN IN / REGISTER" button', () => {
    cy.visit('/')
    cy.get('button[aria-label="sign in or register"]').click()
  })

  it('Enter credentials and click sign in', () => {
    cy.get('input[formcontrolname="username"]')
      .type('unverified@mailinator.com')
      .should('have.value', 'unverified@mailinator.com')
    cy.get('input[formcontrolname="password"]')
      .type('test1234')
      .should('have.value', 'test1234')
      .and('have.attr', 'type', 'password')
    cy.get('button[type="submit"]').click()
  })

  it('Resend verification message twice', () => {
    cy.contains('Resend verification email').click()
    cy.wait(1000)
    cy.get('button').filter('.btn-white-no-border').contains('Close').click()
    cy.get('.edit-biography').click({ force: true })
    cy.contains('Resend verification email').click()
    cy.wait(1000)
    cy.get('button').filter('.btn-white-no-border').contains('Close').click()
  })
})
