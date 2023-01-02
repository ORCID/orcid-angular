/// <reference types="cypress" />

import inboxNotifUsers from '../../fixtures/inboxNotif-users.fixture.json'
import testingUsers from '../../fixtures/testing-users.fixture.json'

describe('Inbox: add someone as trusted individual', async function () {
  before(() => {
    //log in
    cy.visit(Cypress.env('signInURL'))
    cy.signin(inboxNotifUsers.cyNotifPerm)
  })

  it('Notification is received when user adds someone as trusted individual', function () {
    //go to inbox
    cy.get('#cy-user-info').click()
    cy.get('#cy-trusted-parties-panel').wait(1000).click({ force: true })
    cy.get('app-settings-trusted-individuals-search').within(() => {
      cy.get('input').clear().type(testingUsers.cyAcctSettVisibilityUser.oid)
      cy.get('#cy-search-orcid-for-trusted-individuals').click()
    })
    cy.wait(2000) //time to search and load modal
    cy.get('#cy-add-as-trusted-individual').click({ force: true })
    //verify record was added under Trusted Individuals section
    cy.get('app-settings-trusted-individuals').within(() => {
      cy.get('td').contains(testingUsers.cyAcctSettVisibilityUser.oid)
    })
    //go check the inbox has the corresponding notification
    cy.get('#cy-user-info').click()
    cy.get('#cy-inbox').wait(1000).click({ force: true })

    cy.get('app-notification').contains('YOUR RECORD').click()
    cy.contains('Trusted Individual').should('be.visible')
  })

  after(() => {
    //CLEAN INBOX: archive all notifications
    cy.get('[class="control-container"]').within(() => {
      cy.get('mat-checkbox').click()
    })
    cy.get('button').contains('Archive').click()
    cy.wait(2000) //wait for back end to complete
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
