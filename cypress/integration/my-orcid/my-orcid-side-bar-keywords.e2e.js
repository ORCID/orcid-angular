/// <reference types="cypress" />
import { environment } from '../../cypress.env'
const randomUser = require('../../helpers/randomUser')
const runInfo = require('../../helpers/runInfo')

const description = 'Website description'
const website = 'https://orcid.org'

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
describe('My Orcid sidebar - Keywords' + runInfo(), () => {
  before(() => {
    cy.programmaticSignin('testUser')
  })
  before(() => {
    cy.visit(`${environment.baseUrl}/qa/my-orcid`)
  })
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
  })
  describe('Keywords', () => {
    before(() => {
      cy.cleanKeywords()
    })
    beforeEach(() => {
      Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
    })
    after(() => {
      cy.cleanKeywords()
    })
    it('display a user with no items', () => {
      cy.get('#keywords-panel').within(() => {
        cy.get('.body').get('.line').should('not.exist')
      })
    })
    it('add item and display it with default privacy', () => {
      // Expect changes to be display outside and inside of the modal
      cy.get('#keywords-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('#add-keyword')
        .click()
        .get('#content-input')
        .click()
        .type('keyword1', { delay: 50 })
        .get('#save-keywords-button')
        .click()
        .wait(1000)
        .get('#keywords-panel')
        .within(() => {
          cy.get('.body')
            .children()
            .should('have.length', 1)
            .get('app-panel-privacy')
            .should(
              'have.attr',
              'aria-label',
              environment.testUser.defaultPrivacy
            )
        })
        .get('#keywords-panel')
        .within(() => {
          cy.get('.body')
            .children()
            .should('have.length', 1)
            .get('.line')
            .contains('keyword1')
        })
    })
    it('remove/delete', () => {
      cy.get('#keywords-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('.delete-button')
        .click()
        .get('#save-keywords-button')
        .click()
        .wait(1000)
        .get('#keywords-panel')
        .within(() => {
          cy.get('.body').get('.line').should('not.exist')
        })
    })
    it('add multiple keywords', () => {
      cy.get('#keywords-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('#add-keyword')
        .click()
        .get('.mat-form-field-flex')
        .eq(0)
        .click({ multiple: true })
        .type('Keyword1', { delay: 50 })
        .get('#add-keyword')
        .click()
        .get('.mat-form-field-flex')
        .eq(1)
        .click({ multiple: true })
        .type('Keyword2', { delay: 50 })
        .get('#add-keyword')
        .click()
        .get('.mat-form-field-flex')
        .eq(2)
        .click({ multiple: true })
        .type('Keyword3', { delay: 50 })
        .get('#save-keywords-button')
        .click()
        .wait(1000)
        .get('#keywords-panel')
        .within(() => {
          cy.contains('Keyword1')
          cy.contains('Keyword2')
          cy.contains('Keyword3')
          cy.get('.body')
            .get('.line')
            .should('have.length', 3)
            .get('app-panel-privacy')
            .should(
              'have.attr',
              'aria-label',
              environment.testUser.defaultPrivacy
            )
        })
    })
    it('Drag and drop to rearrange', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('change privacy', () => {
      cy.get('#keywords-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .within(() => {
          cy.get('.public-button')
            .click({ multiple: true })
            .get('#save-keywords-button')
            .click()
            .wait(1000)
        })
        .get('#keywords-panel')
        .within(() => {
          cy.get('.body')
            .get('.line')
            .should('have.length', 3)
            .get('app-panel-privacy')
            .should('have.attr', 'aria-label', 'PUBLIC')
        })
    })
    it('make changes and cancel', () => {
      cy.get('#keywords-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .within(() => {
          cy.get('.private-button')
            .click({ multiple: true })
            .get('#cancel-keywords-button')
            .click()
            .wait(1000)
        })
        .get('#keywords-panel')
        .within(() => {
          cy.get('.body')
            .get('.line')
            .should('have.length', 3)
            .get('app-panel-privacy')
            .should('have.attr', 'aria-label', 'PUBLIC')
        })
    })
  })
})
