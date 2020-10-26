context('About page', () => {
  beforeEach(() => {
    cy.visit('/content/about-orcid')
  })

  it('Has three articlesr', () => {
    cy.get('h2').should('have.length', 5)
  })
})
