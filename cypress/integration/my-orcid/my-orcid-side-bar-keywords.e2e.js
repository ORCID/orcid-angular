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
describe.only('My Orcid sidebar - Keywords' + runInfo(), () => {
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
        cy.get('[body=""]').should('not.exist')
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
        .type('keyword1', { delay: 100 })
        .get('#save-keywords-button')
        .click()
        .get('#keywords-panel')
        .within(() => {
          cy.get('[body=""]')
            .children()
            .should('have.length', 1)
            .get('app-panel-privacy')
            .should(
              'have.attr',
              'aria-label',
              environment.testUser.defaultPrivacy
            )
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
        .wait(2000)
        .get('#countries-panel')
        .within(() => {
          cy.get('[body=""]').should('not.exist')
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
        .type('Keyword1', { delay: 100 })        
        .get('#add-keyword')
        .click()
        .get('.mat-form-field-flex')        
        .eq(1)
        .click({ multiple: true })
        .type('Keyword2', { delay: 100 })        
        .get('#add-keyword')
        .click()
        .get('.mat-form-field-flex')        
        .eq(2)
        .click({ multiple: true })
        .type('Keyword3', { delay: 100 })
        .get('#save-keywords-button')
        .click()
        .get('#keywords-panel')
        .within(() => {
          cy.get('[body=""]')
            .children()
            .should('have.length', 3)
            .get('app-panel-privacy')
            .should(
              'have.attr',
              'aria-label',
              environment.testUser.defaultPrivacy
            )
        })
    })
      // Expect changes to be display outside and inside of the modal
  })
})