/// <reference types="cypress" />

import userData from '../../fixtures/inboxNotif-users.fixture.json'

describe('Inbox: Permission Notification', async function () {
  before(() => {
    //log in
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyNotifPerm)
  })

  it('Verify Permission Notification was received', function () {
    const curlStatement =
      "curl -k -i -H 'Authorization: Bearer " +
      userData.cyNotifPerm.clientBearer +
      "' -H 'Content-type: application/json' -X POST -d '" +
      userData.cyNotifPerm.curlPermissionNotifPath +
      "' " +
      Cypress.env('membersAPI_URL') +
      userData.cyNotifPerm.oid +
      Cypress.env('membersAPI_notifPermEndpoint')

    //trigger permission notification
    cy.exec(curlStatement).then((response) => {
      //verify curl was executed successfully
      expect(response.code).to.eq(0)
      //verify http response status is successful: 201
      expect(response.stdout).to.contain('HTTP/2 201')
    })
    //check inbox
    cy.get('#cy-user-info').click()
    cy.get('#cy-inbox').wait(1000).click({ force: true })
    cy.get('app-notification').contains('PERMISSIONS').click()
    //check the button to grant permission is displayed
    cy.get('button').contains('Grant permission').should('be.visible')
  })

  after(() => {
    //CLEAN INBOX: archive notification
    cy.get('app-notification').within(() => {
      cy.get('button').contains('Archive').click()
    })
    cy.wait(2000) //wait for back end to complete
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
