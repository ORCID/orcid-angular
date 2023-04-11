/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'

describe('Public record page: validate public affiliations are displayed', async function () {
  var testUser = userData.cyUserPublicPagePublicAffiliations

  beforeEach(() => {
    cy.visit('/' + testUser.oid)
  })

  it('Public employment data is displayed', function () {
    cy.get('#cy-affiliation-employment').should(
      'contain',
      testUser.publicEmployment
    )
  })
  it('Public education data is displayed', function () {
    cy.get('#cy-affiliation-education-and-qualification').should(
      'contain',
      testUser.publicEducation
    )
  })
  it('Public distintions data is displayed', function () {
    cy.get('#cy-affiliation-invited-position-and-distinction').should(
      'contain',
      testUser.publicDistinction
    )
  })
  it('Public services data is displayed', function () {
    cy.get('#cy-affiliation-membership-and-service').should(
      'contain',
      testUser.publicService
    )
  })
  it('Public works data is displayed', function () {
    cy.get('#cy-works').should('contain', testUser.publicWork)
  })
  it('Public fundings data is displayed', function () {
    cy.get('#cy-fundings').should('contain', testUser.publicFunding)
  })
  it('Public peer reviews data is displayed', function () {
    cy.get('#cy-peer-reviews').within(() => {
      cy.get('.cy-panel-component-expand-button').click()
      cy.get('.cy-panel-component').should('contain', testUser.publicPRdate)
    })
  })
})
