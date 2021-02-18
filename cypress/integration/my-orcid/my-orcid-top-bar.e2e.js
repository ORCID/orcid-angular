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
    it('display user published name if exists"', () => {})
    it('display user given names and family names"', () => {})
    it('display multiple other names if exists with privacy"', () => {})

    describe('Names edit modals' + runInfo(), () => {
      it('edit user given names"', () => {
        // Expect changes to be display outside and inside of the modal
      })
      it('edit user family names"', () => {
        // Expect changes to be display outside and inside of the modal
      })
      it('edit user published name"', () => {
        // Expect changes to be display outside and inside of the modal
      })
      it('edit user names privacy"', () => {
        // Expect changes to be display outside and inside of the modal
      })
      it('add other names with default privacy', () => {
        // Expect changes to be display outside and inside of the modal
      })
      it('remove/delete other names', () => {
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
      it('clicks outside and DONT close the modal ', () => {})
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
        .get('.mat-form-field-flex')
        .type('biography')
        .get('#save-biography-button')
        .click()
        .get('#biography-panel')
        .within(() => {
          cy.get('[body=""]')
            .children()
            .get('#biography')
            .should('contain', 'biography')
            .get('app-panel-privacy')
            .should(
              'have.attr',
              'aria-label',
              environment.testUser.defaultPrivacy
            )
        })
    })
    it('edit user biography privacy"', () => {
      // Expect changes to be display outside and inside of the modal
    })
    it('make changes and cancel', () => {
      // Expect changes NOT to be display outside and inside of the modal
    })
    it('clicks outside and DONT close the modal ', () => {})
  })
})
