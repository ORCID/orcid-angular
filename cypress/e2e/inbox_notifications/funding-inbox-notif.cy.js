/// <reference types="cypress" />

import userData from '../../fixtures/inboxNotif-users.fixture.json'

describe('Inbox: add/update/delete funding via API', async function () {
  const curlAddFunding =
    "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -d '" +
    userData.cyNotifPerm.curlFundingPath +
    "' -X POST '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_fundingsEndpoint') +
    "'"

  const curlReadAllFundings =
    "curl -i -H 'Accept: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -X GET '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_allFundingsEndpoint') +
    "'"

  const curlReadSingleFunding =
    "curl -i -H 'Accept: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -X GET '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_fundingsEndpoint') +
    '/' //here append "{PUTCODE}" + "'"

  const curlPutFunding =
    "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -d '" +
    userData.cyNotifPerm.curlFundingUpdatePath +
    "' -X PUT '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_fundingsEndpoint') +
    '/' //here append "{PUTCODE}"

  const curlDeleteFunding =
    "curl -i -H 'Content-type: application/json' -H 'Authorization: Bearer " +
    userData.cyNotifPerm.clientBearer +
    "' -X DELETE '" +
    Cypress.env('membersAPI_URL') +
    userData.cyNotifPerm.oid +
    Cypress.env('membersAPI_fundingsEndpoint') +
    '/' //here append "{PUTCODE}"

  before(() => {
    //log in
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyNotifPerm)
    //go to inbox
    cy.get('#cy-user-info').click()
    cy.get('#cy-inbox').wait(1000).click({ force: true })
  })

  it('Inbox notifications are received when funding is added/updated/deleted via API', function () {
    let putCode
    let updatedContent

    //Client adds funding
    cy.exec(curlAddFunding).then((response) => {
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
    //There should only be one funding
    cy.exec(curlReadAllFundings).then((response) => {
      //verify curl was executed successfully
      expect(response.code).to.eq(0)
      //verify http response status is successful: 200
      expect(response.stdout).to.contain('HTTP/2 200')
      //grab put code
      const responseString = response.stdout
      const putcodeIndex = responseString.indexOf('funding/')
      const putCodeStartPosition = putcodeIndex + 8 // +length
      const putCodeEndPosition = responseString.indexOf('","display-index')
      putCode = responseString.substring(
        putCodeStartPosition,
        putCodeEndPosition
      )
      cy.log(putCode)
      cy.exec(curlReadSingleFunding + putCode + "'").then((singleFundResp) => {
        //remove non json header from string
        const jsonStartIndex = singleFundResp.stdout.indexOf('{"created-date"') //where does the json start?
        updatedContent = singleFundResp.stdout.substring(jsonStartIndex)
        //update the employment: make a change in the content
        updatedContent = updatedContent.replace(
          userData.cyNotifPerm.fundingToBeReplaced,
          userData.cyNotifPerm.fundingReplaceWith
        )
        //write the file to use for the PUT
        cy.writeFile(
          userData.cyNotifPerm.funding_putWriteFilePath,
          updatedContent
        )
      })

      //Client Updates the work
      cy.exec(curlPutFunding + putCode + "'").then((responsePUT) => {
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

      //Client deletes work with that put code
      cy.exec(curlDeleteFunding + putCode + "'").then((responseDelete) => {
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
