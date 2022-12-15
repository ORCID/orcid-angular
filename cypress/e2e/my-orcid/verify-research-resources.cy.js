/// <reference types="cypress" />
import userData from '../../fixtures/testing-users.fixture.json'

describe('My orcid - users can have research resources data in their record', async function () {
  before(() => {
    cy.programmaticallySignin('cyResearchResourcesUser') //send user key from fixture file
    cy.visit('/my-orcid')
    cy.get('#cy-research-resources') //wait for page to load
  })

  it('Research resources section is displayed IF user has data for that section', function () {
    //Verify the title of one of the entries for the research resources for the user
    cy.get('#cy-research-resources').within(($myPanel) => {
      cy.get('.cy-panel-component').should(
        'contain',
        userData.cyResearchResourcesUser.researchResourceTitle
      )
    })
  })

  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
})
