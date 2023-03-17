/// <reference types="cypress" />

import userData from '../../fixtures/testing-users.fixture.json'
import { qase } from 'cypress-qase-reporter/dist/mocha'


describe('User without verified primary email address can edit Names section', async function () {
  const addPublishedName = 'Cypress Published Name'

  before(() => {
    cy.visit('/')
  })

 qase(
  '107',
  it('User without verified primary email address can edit Names section', function () {
    //click Sign in
    cy.get('#menu-signin-button').click()

    //sign in with registered user
    cy.get('#username').clear().type(userData.cyUserPrimaryEmailNotVerified.oid)
    cy.get('#password')
      .clear()
      .type(userData.cyUserPrimaryEmailNotVerified.password)
    cy.get('#signin-button').click()
    
    cy.get('#names-panel').within(($namePanel) => {
      cy.get('.cy-edit-button').click()
    })
    cy.get('#published-names-input').wait(1000).clear().type(addPublishedName)
    cy.get('#save-names-button').click()
    cy.wait(2000)//wait for back end to complete

    //verify the name is displayed
    cy.get('#publishedName').then(($content) => {
      let textFound = $content.text()
      cy.log(textFound)
      textFound = textFound.trim()
      cy.log(textFound)
      expect(textFound).equal(addPublishedName)
    })
  })
  ) //end of qase tag
  after(() => {
    //log out
    cy.get('#cy-user-info').click()
    cy.get('#cy-signout').click({ force: true })
  })
  
})
