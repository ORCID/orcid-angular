import { environment } from '../../cypress.env'

const randomUser = require('../../helpers/randomUser')
const runInfo = require('../../helpers/runInfo')
const givenNames = 'My name'
const familyNames = 'My family names'
const publishedNames = 'My published name'
const biography = 'My biography'

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
describe('My Orcid top bar' + runInfo(), () => {
  before(() => {
    cy.programmaticSignin('testUser')
  })
  before(() => {
    cy.visit(`${environment.baseUrl}/qa/my-orcid`)
  })
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
  })
  describe('Top bar buttons', () => {
    it('display `Printable version` button', () => {})
    it('display `Get a QR code for your ORCID iD` button', () => {})
    it('display `Display your iD on other sites` button', () => {})
  })
  describe('Names' + runInfo(), () => {
    before(() => {
      cy.cleanNames()
      cy.cleanOtherNames()
    })
    beforeEach(() => {
      Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
    })
    after(() => {
      cy.cleanNames()
      cy.cleanOtherNames()
    })
    it('display user with names and no other names"', () => {
      cy.get('#names-panel').within(() => {
        cy.get('[body=""]')
          .children()
          .get('#publishedName')
          .should('not.be.empty')
          .get('#givenAndFamilyNames')
          .should('not.be.empty')
          .get('#other-names')
          .should('not.exist')
      })
    })
    it('edit user given names, family names and published name"', () => {
      cy.get('#names-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('#given-names-input').click().clear()
        .get('#given-names-input')
        .click()
        .type(givenNames, { delay: 0 })
        .get('#family-names-input').click().clear()
        .get('#family-names-input')
        .click()
        .type(familyNames, { delay: 0 })
        .get('#published-names-input').click().clear()
        .get('#published-names-input')
        .click()
        .type(publishedNames, { delay: 0 })
        .get('#save-names-button')
        .click()
        .get('#names-panel')
        .within(() => {
          cy.get('[body=""]')
            .children()
            .get('#publishedName')
            .should('contain', publishedNames)
            .get('#givenAndFamilyNames')
            .should('contain', givenNames + ' ' + familyNames)
            .get('#other-names')
            .should('not.exist')
            .get('app-panel-privacy')
            .should(
              'have.attr',
              'aria-label',
              environment.testUser.defaultPrivacy
            )
        })
    })
    it('add other names with default privacy', () => {
      cy.get('#names-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('#add-link')
        .click()
        .get('#alternative-names-input')
        .click()
        .type('Other Name 1',{ delay: 0 })
        .get('#save-names-button')
        .click()
        .get('#names-panel')
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
    it('remove/delete other names', () => {
      cy.get('#names-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('#delete-button')
        .click()
        .get('#save-names-button')
        .click()
        .wait(2000)
        .get('#names-panel')
        .within(() => {
          cy.get('[body=""]')
            .children()
            .get('#publishedName')
            .should('not.be.empty')
        })
    })
  })
  describe('Biography', () => {
    before(() => {
      cy.cleanBiography()
    })
    beforeEach(() => {
      Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
    })
    after(() => {
      cy.cleanBiography()
    })
    it('display user biography if exists and privacy"', () => {
      cy.get('#biography-panel').within(() => {
        cy.get('[body=""]').should('not.exist')
      })
    })
    it('edit user biography"', () => {
      cy.get('#biography-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('#biography-input')
        .click()
        .type(biography, { delay: 0 })
        .get('#save-biography-button')
        .click()
        .get('#biography-panel')
        .within(() => {
          cy.get('[body=""]')
            .children()
            .get('#biography')
            .should('contain', biography)
            .get('app-panel-privacy')
            .should(
              'have.attr',
              'aria-label',
              environment.testUser.defaultPrivacy
            )
        })
    })
    it('edit user biography privacy"', () => {
      cy.get('#biography-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('.public-button')
        .click({ multiple: true })
        .get('#save-biography-button')
        .click()
        .get('#biography-panel')
        .within(() => {
          cy.get('[body=""]')
            .children()
            .get('#biography')
            .should('contain', biography)
            .get('app-panel-privacy')
            .should('have.attr', 'aria-label', 'PUBLIC')
        })
    })
    it('make changes and cancel', () => {
      cy.get('#biography-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('.private-button')
        .click({ multiple: true })
        .get('#cancel-biography-button')
        .click()
        .get('#biography-panel')
        .within(() => {
          cy.get('[body=""]')
            .children()
            .should('contain', biography)
            .get('app-panel-privacy')
            .should('have.attr', 'aria-label', 'PUBLIC')
        })
    })
  })
})
