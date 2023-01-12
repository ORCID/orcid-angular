/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('Add more contributors while editing a work with 50 contributors', async function () {
  const workTitle = 'QASE19'
  const noticeMessage = 'You cannot add any more contributors to this work'

  before(() => {
    //log in with user that has 50 contrib
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cy50Contrib)
  })

  qase(
    '19',
    it('Add more contributors while editing a work with 50 contributors', function () {
      //edit work added
      cy.contains('app-work-stack', workTitle).within(($thisWork) => {
        cy.get('button[aria-label*="Edit work"]').click()
      })
      //verify link to add one more contrib is disabled
      cy.get('#cy-add-another-contributor').should('have.class', 'disabled')

      //verify the panel is displayed
      cy.contains('.notice-panel', noticeMessage)
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
