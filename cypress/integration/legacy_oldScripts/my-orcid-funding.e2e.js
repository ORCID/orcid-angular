/// <reference types="cypress" />
import { environment } from '../../cypress.env'
const randomUser = require('../../helpers/randomUser')
const runInfo = require('../../helpers/runInfo')

describe('Funding' + runInfo(), () => {
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
      cy.get('h2').should('not.exist')
    })
  })

  it('programatically add a funding and verify it displays correctly', () => {
    cy.createFunding()
      .reload(true)
      .get('app-fundings')
      .within(() => {
        cy.get('h2').contains('Funding title')
        cy.get('app-funding').within(() => {
          cy.get('app-panel-data')
            .eq(0)
            .within(() => {
              cy.get('.data-content').within(() => {
                cy.contains('2000-01 to 2031-12 | Award')
                cy.contains('http://qa.orcid.org')
                cy.contains('grant_number:').contains('1234567890')
              })
              cy.get('.align-end-content').find('a').click()
            })
          cy.get('app-panel-data')
            .eq(1)
            .within(() => {
              cy.get('.data-content').within(() => {
                cy.contains('CRC 1,000,000')
                cy.contains('(Spanish)')
                cy.contains('Translated title')
                cy.contains('This is the description')
              })
            })
        })
      })
  })
})
