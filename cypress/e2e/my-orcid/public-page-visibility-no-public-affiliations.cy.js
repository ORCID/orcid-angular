/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'

describe('Public record page: validate data limited or private is not displayed', async function () {
  const testUser = userData.cyUserPublicPageNoAffiliations

  beforeEach(() => {
    cy.visit('/' + testUser.oid)
  })

  it('Only public names are displayed', function () {
    cy.get('#main')
      .should('contain', testUser.username)
      .and('contain', testUser.publicOtherName)
      .and('not.contain', testUser.privateName)
      .and('not.contain', testUser.limitedName)
  })

  it('Only public emails are displayed', function () {
    cy.get('#emails-panel')
      .should('contain', testUser.email)
      .and('not.contain', testUser.privateEmail)
      .and('not.contain', testUser.limitedEmail)
  })

  it('Only public websites are displayed', function () {
    cy.get('#websites-panel')
      .should('contain', testUser.publicLink)
      .and('not.contain', testUser.privateLink)
      .and('not.contain', testUser.limitedLink)
  })

  it('Only public keywords are displayed', function () {
    cy.get('#keywords-panel')
      .should('contain', testUser.publicKeyword)
      .and('not.contain', testUser.privateKeyword)
      .and('not.contain', testUser.limitedKeyword)
  })

  it('Only public countries are displayed', function () {
    cy.get('#countries-panel')
      .should('contain', testUser.publicCountry)
      .and('not.contain', testUser.privateCountry)
      .and('not.contain', testUser.limitedCountry)
  })

  it('Verify public biography is displayed', function () {
    cy.get('#main').should('contain', testUser.publicBio)
  })

  it('Verify message is displayed for users with no public affiliations', function () {
    cy.get('#main').should('contain', testUser.noInfoMessage)
  })
})
