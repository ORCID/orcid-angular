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
describe('My Orcid main bar' + runInfo(), () => {
  before(() => {
    cy.programmaticSignin('testUser')
  })
  before(() => {
    cy.visit(`${environment.baseUrl}/qa/my-orcid`)
  })
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
  })
  describe('Employment', () => {
    it('display a user with no items', () => {})
    it('add items and display those with default privacy', () => {
      // Expect changes to be display outside and inside of the modal
    })
  })
  describe('Education and Qualifications', () => {
    it('display a user with no items', () => {})
  })
  describe('Invited positions and Distinctions', () => {
    it('display a user with no items', () => {})
  })
  describe('Membership and Service', () => {
    it('display a user with no items', () => {})
  })
  describe('Funding', () => {
    it('display a user with no items', () => {})
  })
  describe('Works', () => {
    it('display a user with no items', () => {})
  })
  describe('Peer review', () => {
    it('display a user with no items', () => {})
  })
  describe('Last modified date', () => {
    it('display a user with no items', () => {})
  })
})
