/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Counter in contributors section updates accordingly while adding a work', async function () {
  before(() => {
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
  })

  qase(
    '6',
    it('Counter in contributors section is updated accordingly while adding a work', function () {
      cy.get('#cy-works').within(($myPanel) => {
        cy.get('#cy-menu-add-works').click()
      })
      cy.get('#cy-add-work-manually').click({ force: true })

      //only record owner listed
      cy.get('app-work-contributors').contains('Contributors to this work (1)')
      //add a second contributor
      cy.get('.cy-add-another-contributor').click()
      cy.get('#draggable-1').within(()=>{
        cy.get('[formcontrolname="creditName"]').clear().type('Name2')
      })
      cy.get('app-work-contributors').contains('Contributors to this work (2)')
      //add a third contributor
      cy.get('.cy-add-another-contributor').click()
      cy.get('#draggable-2').within(()=>{
        cy.get('[formcontrolname="creditName"]').clear().type('Name3')
      })
      cy.get('app-work-contributors').contains('Contributors to this work (3)')

      //remove second contributor
      cy.get('app-work-contributors').within(($contribSection) => {
        cy.get('#cy-delete-button-1').click()
      })
      cy.get('app-work-contributors').contains('Contributors to this work (2)')

      //remove third contributor
      cy.get('app-work-contributors').within(($contribSection) => {
        cy.get('#cy-delete-button-1').click()
      })
      cy.get('app-work-contributors').contains('Contributors to this work (1)')

      //close form
      cy.get('#cancel-work-button')
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
