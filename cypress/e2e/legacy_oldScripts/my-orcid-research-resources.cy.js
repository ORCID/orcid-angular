import { environment } from '../../cypress.env'

const randomUser = require('../../helpers/randomUser')
const runInfo = require('../../helpers/runInfo')

Cypress.Commands.add(
  'dragTo',
  { prevSubject: 'element' },
  (subject, droppableSelector) => {
    const coords = Cypress.$(droppableSelector)[0].getBoundingClientRect()
    cy.wrap(subject)
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', { clientX: coords.x + 10, clientY: coords.y + 10 })
      .trigger('mouseup', { force: true })
  }
)

describe('My Orcid research resources' + runInfo(), () => {
  before(() => {
    cy.programmaticSignin('testUser')
  })
  before(() => {
    cy.visit(`${environment.baseUrl}/qa/my-orcid`)
  })
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
  })
  describe('Research resources' + runInfo(), () => {
    it('show research resources panel and hide nested panels', () => {
      cy.get('#research-resources-panel')
        .get(
          '#research-resources-panel > .col > .header-container > .inline-initial-side > .text-container'
        )
        .should('exist')
        .get('#research-resources-panel')
        .within(() => {
          cy.get('#expand-content-button').click()
        })
        .get('#panel-0')
        .should('not.exist')
        .get('#research-resources-panel')
        .within(() => {
          cy.get('#expand-content-button').click()
        })
    })
  })
  describe('Research resources' + runInfo(), () => {
    it('show research resources description', () => {
      cy.get('#research-resources-panel')
        .get('#panel-0')
        .within(() => {
          cy.get('#expand-more-button').click()
        })
        .get('#panel-0')
        .get('.description-container > .description')
        .should('exist')
        .get('#show-more-button')
        .click()
        .get('.organization-identifiers')
        .should('exist')
        .get('#research-detail-item-0')
        .within(() => {
          cy.get('#show-more-item-button').click()
        })
        .get(
          '.orc-font-body-small.ng-star-inserted > .panel-data-container > .data-content > app-panel-element > :nth-child(1) > .line > :nth-child(1)'
        )
        .should('exist')
        .get('#research-detail-item-0')
        .within(() => {
          cy.get('#show-less-item-button').click()
        })
        .get(
          '.orc-font-body-small.ng-star-inserted > .panel-data-container > .data-content > app-panel-element > :nth-child(1) > .line > :nth-child(1)'
        )
        .should('not.exist')
        .get('#panel-0')
        .get('#show-less-button')
        .click()
        .get('.organization-identifiers')
        .should('not.exist')
    })
  })
})
