/// <reference types="cypress" />
import { environment } from '../../cypress.env'
const randomUser = require('../../helpers/randomUser')
const runInfo = require('../../helpers/runInfo')


describe.only('Funding' + runInfo(), () => {
  before(() => {
    cy.programmaticSignin('testUser')
  })
  before(() => {
    cy.visit(`${environment.baseUrl}/qa/my-orcid`)
  })
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
  })

  it('display a user with no fundings', () => {
    cy.get('app-fundings').within(() => {
      cy.get('[body=""]').should('not.exist')
    })
  })

  it('programatically add a funding and verify it displays correctly', () => {
    cy.createFunding()
    .reload(true)
    .get('app-fundings').within(() => {
      cy.get('h2').contains('Funding title')
      cy.contains('2000-01 to 2031-12 | Award')
    })
  })

})
