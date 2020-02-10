context('Home page', () => {
  beforeEach(() => {
    cy.visit('/content/about-orcid')
  })

  it('Has a search bar', () => {
    cy.get('h2').should('have.length', 5)
  })
})
