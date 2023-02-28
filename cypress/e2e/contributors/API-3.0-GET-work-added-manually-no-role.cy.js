/// <reference types="cypress" />

import userData from '../../fixtures/contributors-fixtures/contributors-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'

describe('API 3.0 - GET work added manually', async function () {
  const curlReadAllWorks =
    "curl -i -H 'Accept: application/json' -H 'Authorization: Bearer " +
    userData.cyRecordOwner.clientBearer +
    "' -X GET '" +
    Cypress.env('membersAPI_URL') +
    userData.cyRecordOwner.oid +
    Cypress.env('membersAPI_allWorksEndpoint') +
    "'"

  const curlReadSingleWork =
    "curl -i -H 'Accept: application/json' -H 'Authorization: Bearer " +
    userData.cyRecordOwner.clientBearer +
    "' -X GET '" +
    Cypress.env('membersAPI_URL') +
    userData.cyRecordOwner.oid +
    Cypress.env('membersAPI_workEndpoint') +
    '/' //here append "{PUTCODE}" + "'"

  before(() => {
    cy.visit(Cypress.env('signInURL'))
    cy.signin(userData.cyRecordOwner)
  })

  qase(
    '35',
    it('API 3.0 - GET work added manually - no role', function () {
      let putCode
      const workType = 'Book'
      const title = 'Cypress test contributors'
      const otherContributorName = 'Michael Jordan'

      cy.get('#cy-works').within(($myPanel) => {
        cy.get('#cy-menu-add-works').click()
      })
      cy.get('#cy-add-work-manually').click({ force: true })
      cy.get('#cy-work-types').click()
      cy.get('#cy-work-types-panel').within(($myOptions) => {
        cy.contains(workType).click()
      })
      cy.get('#title-input').clear().type(title)

      //add someone else as contributor with credit role
      cy.get('.cy-add-another-contributor').click()
      cy.get('app-work-contributors').within(($section) => {
        cy.get('[formcontrolname="creditName"]')
          .clear()
          .type(otherContributorName)
      })

      //save entry
      cy.get('#save-work-button').wait(1000).click({ force: true })
      cy.wait(2000)

      //Verify work was added
      cy.contains('app-panel-data', otherContributorName).within(
        ($thisWork) => {
          cy.contains('Show more detail').click()
        }
      )

      //verify contributor is displayed in details section for this work
      cy.get('app-display-attribute').contains(otherContributorName)

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
        cy.log('putCode found:' + putCode)
        cy.exec(curlReadSingleWork + putCode + "'").then((singleWorkResp) => {
          //verify curl was executed successfully
          expect(singleWorkResp.code).to.eq(0)
          //verify http response status is successful: 200
          expect(singleWorkResp.stdout).to.contain('HTTP/2 200')
        })
      })
    })
  ) //end of qase tag

  after(() => {
    //log out
    cy.get('#cy-user-info').click({ force: true })
    cy.get('#cy-signout').click({ force: true })
  })
})
