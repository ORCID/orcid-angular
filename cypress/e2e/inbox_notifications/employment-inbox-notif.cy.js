/// <reference types="cypress" />

import userData from '../../fixtures/inboxNotif-users.fixture.json'

describe('Inbox: add/update/delete Employment via API', async function () {
  const curlAddEmployment =
    "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -d '" +
    userData.cyNotifPerm.curlEmploymentPath +
    "' -X POST '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_employmentEndpoint') +
    "'"

  const curlReadAllEmployments =
    "curl -i -H 'Accept: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -X GET '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_allEmploymentsEndpoint') +
    "'"

  const curlReadSingleEmployment =
    "curl -i -H 'Accept: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -X GET '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_employmentEndpoint') +
    '/' //here append "{PUTCODE}" + "'"

  const curlPutEmployment =
    "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -d '" +
    userData.cyNotifPerm.curlEmploymentUpdatePath +
    "' -X PUT '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_employmentEndpoint') +
    '/' //here append "{PUTCODE}"+ "'"

  const curlDeleteEmployment =
    "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -X DELETE '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_employmentEndpoint') +
    '/' //here append "{PUTCODE}"+ "'"

  before(() => {
    //log in
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyNotifPerm)
    //go to inbox
    cy.get('#cy-user-info').click()
    cy.get('#cy-inbox').wait(1000).click({ force: true })
  })

  it('Inbox notifications are received when Employment is added/updated/deleted via API', function () {
    let putCode
    let updatedContent

    //Client adds an employment
    cy.exec(curlAddEmployment).then((response) => {
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

    //Read employments to grab putcode
    //There should only be one employment
    cy.exec(curlReadAllEmployments).then((response) => {
      //verify curl was executed successfully
      expect(response.code).to.eq(0)
      //verify http response status is successful: 200
      expect(response.stdout).to.contain('HTTP/2 200')
      //grab put code
      const responseString = response.stdout
      const putcodeIndex = responseString.indexOf('put-code":')
      const putCodeStartPosition = putcodeIndex + 10 // +length
      const putCodeEndPosition = responseString.indexOf(',"department')
      putCode = responseString.substring(
        putCodeStartPosition,
        putCodeEndPosition
      )
      cy.exec(curlReadSingleEmployment + putCode + "'").then(
        (singleEmploymentResp) => {
          //remove non json header from string
          const jsonStartIndex =
            singleEmploymentResp.stdout.indexOf('{"created-date"') //where does the json start?
          updatedContent = singleEmploymentResp.stdout.substring(jsonStartIndex)
          //update the employment: make a change in the content
          updatedContent = updatedContent.replace(
            userData.cyNotifPerm.contentToBeReplaced,
            userData.cyNotifPerm.replaceWith
          )
          //write the file to use for the PUT
          cy.writeFile(userData.cyNotifPerm.putWriteFilePath, updatedContent)
        }
      )

      //Client Updates the employment
      cy.exec(curlPutEmployment + putCode + "'").then((responsePUT) => {
        //verify curl was executed successfully
        expect(responsePUT.code).to.eq(0)
        //verify http response status is successful: 200
        expect(responsePUT.stdout).to.contain('HTTP/2 200')
      })
      //#2 verify the notification is received for updating
      cy.reload()
      cy.wait(2000)
      cy.get('app-notification').contains('YOUR RECORD').click()
      cy.contains('Updated').should('be.visible')

      //Client deletes employment with that put code
      cy.exec(curlDeleteEmployment + putCode + "'").then((responseDelete) => {
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
