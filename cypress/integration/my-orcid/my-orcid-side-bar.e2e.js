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
describe('My Orcid sidebar' + runInfo(), () => {
  before(() => {
    cy.programmaticSignin('testUser')
  })
  before(() => {
    cy.visit(`${environment.baseUrl}/qa/my-orcid`)
  })
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
  })
  describe('Orcid id', () => {
    it('display the users Orcid', () => {
      cy.get('app-side-bar-id ').within(() => {
        cy.contains(`${environment.baseUrl}`)
        cy.contains(environment.testUser.id)
      })
    })
    it('display url to navigate to the public page view', () => {})
  })
  describe('Emails' + runInfo(), () => {
    before(() => {
      cy.cleanEmails()
      cy.visit(`${environment.baseUrl}/qa/my-orcid`)
    })
    beforeEach(() => {
      Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
    })
    after(() => {
      cy.cleanEmails()
    })

    it('display a user with only a primary email "unverified"', () => {
      cy.get('#emails-panel').within(() => {
        cy.get('.body').get('.line').should('have.length', 1)
      })
    })
    it('display a user with only a primary email "verified"', () => {})
    it('display multiple emails "unverified" and "verified"', () => {
      // Expect changes to be display outside and inside of the modal
    })
    describe('Emails edit modals' + runInfo(), () => {
      //TODO we need to figure out how to verify emails to improve testing on those

      it('add additional emails and display those as "unverified" as private', () => {
        const randomUserEmail = randomUser()
        cy.get('#emails-panel')
          .within(() => {
            cy.get('#edit-button').click()
          })
          .get('#modal-container')
          .get('#add-link')
          .click()
          .get('#emailInput-1')
          .type(randomUserEmail.email)
          .get('.verify-icon:not(.verified) #emailInput-1')
          .get('#save-emails-button')
          .click()
          .get('#emails-panel')
          .within(() => {
            cy.get('.body')
              .get('.line')
              .should('have.length', 2)
              .get('app-panel-privacy')
              .eq(1)
              .should('have.attr', 'aria-label', 'PRIVATE')
          })
      })
      it('remove emails', () => {
        cy.get('#emails-panel')
          .within(() => {
            cy.get('#edit-button').click()
          })
          .get('#modal-container')
          .get('.delete-button')
          .click()
          .get('#save-emails-button')
          .click()
          .wait(2000)
          .get('#emails-panel')
          .within(() => {
            cy.get('.body').get('.line').should('have.length', 1)
          })
      })

      it('add multiple emails', () => {
        const randomUserEmail = randomUser()
        const randomUserEmail2 = randomUser()
        const randomUserEmail3 = randomUser()
        const randomUserEmail4 = randomUser()
        cy.get('#emails-panel')
          .within(() => {
            cy.get('#edit-button').click()
          })
          .get('#modal-container')
          .get('#add-link')
          .click()
          .get('#emailInput-1')
          .type(randomUserEmail.email)
          .get('#add-link')
          .click()
          .get('#emailInput-2')
          .type(randomUserEmail2.email)
          .get('#add-link')
          .click()
          .get('#emailInput-3')
          .type(randomUserEmail3.email)
          .get('#add-link')
          .click()
          .get('#emailInput-4')
          .type(randomUserEmail4.email)
          .get('#save-emails-button')
          .click()
          .get('#emails-panel')
          .within(() => {
            cy.get('.body').get('.line').should('have.length', 5)
          })
      })

      it('change privacy', () => {
        cy.get('#emails-panel')
          .within(() => {
            cy.get('#edit-button').click()
          })
          .get('#modal-container')
          .get('.public-button')
          .click({ multiple: true })
          .get('#save-emails-button')
          .click()
          .get('#emails-panel')
          .within(() => {
            cy.get('.body')
              .get('.line')
              .should('have.length', 5)
              .get('app-panel-privacy')
              .should('have.attr', 'aria-label', 'PUBLIC')
          })

        // Expect changes to be display outside and inside of the modal
      })

      it('edit a non-primary and display it as "unverified"', () => {
        // Expect changes to be display outside and inside of the modal
      })
      it('edit a primary email and display it as "verified"', () => {
        // Expect changes to be display outside and inside of the modal
      })
      it('display multiple emails "unverified" and "verified"', () => {
        // Expect changes to be display outside and inside of the modal
      })
      it('resend the email verification email', () => {})
      it('set a "verified" email as primary', () => {
        // checks that a secondary email does not have the `make primary` button if not verified
        // Expect changes to be display outside and inside of the modal
      })
      it('make changes and cancel', () => {
        cy.get('#emails-panel')
          .within(() => {
            cy.get('#edit-button').click()
          })
          .get('#modal-container')
          .get('.private-button')
          .click({ multiple: true })
          .get('#cancel-emails-button')
          .click()
          .get('#emails-panel')
          .within(() => {
            cy.get('.body')
              .get('.line')
              .should('have.length', 5)
              .get('app-panel-privacy')
              .should('have.attr', 'aria-label', 'PUBLIC')
          })
      })
      it('open the terms of use on a separate window ', () => {
        cy.get('#emails-panel')
          .within(() => {
            cy.get('#edit-button').click()
          })
          .get('#modal-container')
          .within(() => {
            cy.get('a ').should('have.attr', 'target', '_blank')
          })
          .get('#cancel-emails-button')
          .click()
      })
    })
  })
  describe('Websites and socials links', () => {
    before(() => {
      cy.cleanWebsites()
    })
    beforeEach(() => {
      Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
    })
    after(() => {
      cy.cleanWebsites()
    })
    it('display a user with no items', () => {
      cy.get('#websites-panel').within(() => {
        cy.get('.body').get('.line').should('not.exist')
      })
    })
    it('add items and display those with default privacy', () => {
      cy.get('#websites-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .within(() => {
          cy.get('#add-link')
            .click()
            .get('#description-input')
            .click()
            .type(description, { delay: 0 })
            .get('#url-input')
            .click()
            .type(website, { delay: 0 })
            .get('#save-websites-button')
            .click()
        })
        .get('#websites-panel')
        .within(() => {
          cy.get('.body')
            .get('.line')
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
      cy.get('#websites-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .within(() => {
          cy.get('#delete-button')
            .click()
            .get('#save-websites-button')
            .click()
            .wait(2000)
        })
        .get('#websites-panel')
        .within(() => {
          cy.get('.body').get('.line').should('not.exist')
        })
    })
    it('add multiple websites', () => {
      cy.get('#websites-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .within(() => {
          cy.get('#add-link')
            .click()
            .get('.mat-form-field-flex')
            .eq(0)
            .click({ multiple: true })
            .type('Description Website 1', { delay: 0 })
            .get('.mat-form-field-flex')
            .eq(1)
            .click({ multiple: true })
            .type('https://orcid.org', { delay: 0 })
            .get('#add-link')
            .click()
            .get('.mat-form-field-flex')
            .click({ multiple: true })
            .get('.mat-form-field-flex')
            .eq(2)
            .click()
            .type('Description Website 2', { delay: 0 })
            .get('.mat-form-field-flex')
            .eq(3)
            .click({ multiple: true })
            .type('https://sandbox.orcid.org', { delay: 0 })
            .get('#add-link')
            .click()
            .get('.mat-form-field-flex')
            .eq(4)
            .click()
            .type('Description Website 3', { delay: 0 })
            .get('.mat-form-field-flex')
            .eq(5)
            .click()
            .type('https://qa.orcid.org', { delay: 0 })
            .get('#save-websites-button')
            .click()
        })
        .get('#websites-panel')
        .within(() => {
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
      cy.get('#websites-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .within(() => {
          cy.get('.public-button')
            .click({ multiple: true })
            .get('#save-websites-button')
            .click()
        })
        .get('#websites-panel')
        .within(() => {
          cy.get('.body')
            .get('.line')
            .should('have.length', 3)
            .get('app-panel-privacy')
            .should('have.attr', 'aria-label', 'PUBLIC')
        })
    })
    it('make changes and cancel', () => {
      cy.get('#websites-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .within(() => {
          cy.get('.private-button')
            .click({ multiple: true })
            .get('#cancel-websites-button')
            .click()
        })
        .get('#websites-panel')
        .within(() => {
          cy.get('.body')
            .get('.line')
            .should('have.length', 3)
            .get('app-panel-privacy')
            .should('have.attr', 'aria-label', 'PUBLIC')
        })
    })
    it('clicks outside and DONT close the modal ', () => {})
  })
  describe('Countries', () => {
    before(() => {
      cy.cleanCountries()
    })
    beforeEach(() => {
      Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
    })
    after(() => {
      cy.cleanCountries()
    })
    it('display a user with no items', () => {
      cy.get('#countries-panel').within(() => {
        cy.get('.body').get('.line').should('not.exist')
      })
    })
    it('add items and display those with default privacy', () => {
      cy.get('#countries-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('#add-link')
        .click()
        .get('.mat-form-field-flex')
        .click()
        .get('#mat-select-0-panel')
        .click()
        .get('#save-countries-button')
        .click()
        .get('#countries-panel')
        .within(() => {
          cy.get('.body')
            .get('.line')
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
      cy.get('#countries-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('.delete-button')
        .click()
        .get('#save-countries-button')
        .click()
        .wait(2000)
        .get('#countries-panel')
        .within(() => {
          cy.get('.body').get('.line').should('not.exist')
        })

      // Expect changes to be display outside and inside of the modal
    })
    it('add multiple countries', () => {
      cy.get('#countries-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('#add-link')
        .click()
        .get('.mat-form-field-flex')
        .eq(0)
        .click()
        .get('.mat-option-text')
        .eq(0)
        .click()
        .get('#add-link')
        .click()
        .get('.mat-form-field-flex')
        .eq(1)
        .click()
        .get('.mat-option-text')
        .eq(1)
        .click()
        .get('#add-link')
        .click()
        .get('.mat-form-field-flex')
        .eq(2)
        .click()
        .get('.mat-option-text')
        .eq(2)
        .click()
        .get('#save-countries-button')
        .click()
        .get('#countries-panel')
        .within(() => {
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
      // TODO @leomendoza123 drag and drop with cypress and Material cdkDragHandle seems not to work
    })
    it('change privacy', () => {
      cy.get('#countries-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('.public-button')
        .click({ multiple: true })
        .get('#save-countries-button')
        .click()
        .get('#countries-panel')
        .within(() => {
          cy.get('.body')
            .get('.line')
            .should('have.length', 3)
            .get('app-panel-privacy')
            .should('have.attr', 'aria-label', 'PUBLIC')
        })

      // Expect changes to be display outside and inside of the modal
    })
    it('make changes and cancel', () => {
      cy.get('#countries-panel')
        .within(() => {
          cy.get('#edit-button').click()
        })
        .get('#modal-container')
        .get('.private-button')
        .click({ multiple: true })
        .get('#cancel-countries-button')
        .click()
        .get('#countries-panel')
        .within(() => {
          cy.get('.body')
            .get('.line')
            .should('have.length', 3)
            .get('app-panel-privacy')
            .should('have.attr', 'aria-label', 'PUBLIC')
        })
    })
  })
  describe('Personal identifiers', () => {
    // TODO
    // We need to create a mechanism to add keywords while e2e testing.
    before(() => {
      cy.cleanPersonalIdentifiers()
    })
    beforeEach(() => {
      Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
    })
    after(() => {
      cy.cleanPersonalIdentifiers()
    })

    it('display a user with no items', () => {
      // Users with not personal ids should not show this panel
      cy.get('#personal-identifiers-panel').should('not.exist')
    })
    it('display a user with items and default privacy', () => {})
    it('remove/delete', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('Drag and drop to rearrange', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('change privacy', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('make changes and cancel', () => {
      // Expect changes NOT to be display outside and inside of the modal
    })
  })
  describe('Keywords', () => {
    it('display a user with no items', () => {})
    it('add items and display those with default privacy', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('remove/delete', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('Drag and drop to rearrange', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('change privacy', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('make changes and cancel', () => {
      // Expect changes NOT to be display outside and inside of the modal
    })
  })
})
