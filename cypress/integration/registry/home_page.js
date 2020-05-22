context('Home page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Has the home page title', () => {
    cy.contains('Distinguish yourself in three easy steps').should('exist')
  })

  it('Has a search bar', () => {
    cy.get('app-search').find('input')
  })

  it('It displays three news', () => {
    cy.get('.news-box')
      .children()
      .should('have.length', 3)
  })
})
