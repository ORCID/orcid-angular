/// <reference types="cypress" />

import userData from '../../fixtures/inboxNotif-users.fixture.json'

describe('Inbox: no notification sent when update has no changes', async function () {
  const curlAddWork =
    "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -d '" +
    userData.cyNotifPerm.curlWorkPath +
    "' -X POST '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_workEndpoint') +
    "'"

  const curlReadAllWorks =
    "curl -i -H 'Accept: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -X GET '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_allWorksEndpoint') +
    "'"

  const curlReadSingleWork =
    "curl -i -H 'Accept: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -X GET '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_workEndpoint') +
    '/' //here append "{PUTCODE}" + "'"

  const curlPutWork =
    "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -X PUT -d '" +
    userData.cyNotifPerm.curlWorkUpdatePath +
    "' " +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_workEndpoint') +
    '/' //here append "{PUTCODE}"

  const curlDeleteWork =
    "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -X DELETE " +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_workEndpoint') +
    '/' //here append "{PUTCODE}"

  before(() => {
    //log in
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyNotifPerm)
    //go to inbox
    cy.get('#cy-user-info').click()
    cy.get('#cy-inbox').wait(1000).click({ force: true })
  })

  it('Inbox notifications are not sent when update is sent with no actual changes', function () {
    let putCode
    let updatedContent

    //Client adds an work
    cy.exec(curlAddWork).then((response) => {
      //verify curl was executed successfully
      expect(response.code).to.eq(0)
      //verify http response status is successful: 201
      expect(response.stdout).to.contain('HTTP/2 201')
    })

    //#1 check inbox has the notification for adding
    cy.reload()
    cy.wait(2000)
    cy.get('app-notification').contains('YOUR RECORD').click()
    cy.contains('Added').should('be.visible')
    cy.get('button').contains('Archive').click()

    //Read works to grab putcode
    //There should only be one work
    cy.exec(curlReadAllWorks).then((response) => {
      //verify curl was executed successfully
      expect(response.code).to.eq(0)
      //verify http response status is successful: 200
      expect(response.stdout).to.contain('HTTP/2 200')
      //grab put code
      const responseString = response.stdout
      const putcodeIndex = responseString.indexOf('put-code":')
      const putCodeStartPosition = putcodeIndex + 10 // +length
      const putCodeEndPosition = responseString.indexOf(',"created-date')
      putCode = responseString.substring(
        putCodeStartPosition,
        putCodeEndPosition
      )
      cy.exec(curlReadSingleWork + putCode + "'").then((singleWorkResp) => {
        //remove non json header from string
        const jsonStartIndex = singleWorkResp.stdout.indexOf('{"created-date"') //where does the json start?
        updatedContent = singleWorkResp.stdout.substring(jsonStartIndex)
        //do not make any changes
        //write the file to use for the PUT
        cy.writeFile(userData.cyNotifPerm.work_putWriteFilePath, updatedContent)
      })

      //Client Updates the work
      cy.exec(curlPutWork + putCode).then((responsePUT) => {
        //verify curl was executed successfully
        expect(responsePUT.code).to.eq(0)
        //verify http response status is successful: 200
        expect(responsePUT.stdout).to.contain('HTTP/2 200')
      })
      //#2 verify no notification is received for the PUT
      cy.reload()
      cy.wait(2000)
      cy.get('app-notification').contains('YOUR RECORD').click()
      cy.contains('Updated').should('not.exist')

      //Client deletes work with that put code
      cy.exec(curlDeleteWork + putCode).then((responseDelete) => {
        //verify curl was executed successfully
        expect(responseDelete.code).to.eq(0)
        //verify http response status is successful: 204
        expect(responseDelete.stdout).to.contain('HTTP/2 204')
      })
      //#3 verify the notification was received for deleting
      cy.reload()
      cy.wait(2000)
      cy.get('app-notification').contains('YOUR RECORD').click()
      cy.contains('Deleted').should('be.visible')
    })
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
