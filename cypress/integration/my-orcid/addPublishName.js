/// <reference types="cypress" />

const randomUser = require('../../helpers/randomUser')
import userData from '../../fixtures/testing_users.json'

describe('My orcid - users are able to add content to their record', async function() {

    before(() => {
      cy.visit(Cypress.env('signInURL'))
    })
    
    it('User adds a published name', function() { 
        const addPublishedName = "QA Published Name"
        //sign in
        cy.signin(userData.cyUser_primaryEmaiVerified)
        cy.get('#names-panel').within(($namePanel)=>{
                cy.get('#edit-button').click()
        })
        //clear and type new input
        cy.get('#published-names-input').clear().type(addPublishedName)
        cy.get('#save-names-button').click()
        cy.wait(3000)
        
        //verify the name is displayed  
        cy.get('#publishedName').then(($content) => {
            let textFound = $content.text()
            cy.log(textFound)
           // textFound = textFound.replace(/(\r\n|\n|\r)/gm,'')
           textFound = textFound.trim()
            cy.log(textFound)
            expect(textFound).equal(addPublishedName)
        })    

        //sign out
        cy.get('app-user-menu').click()
        cy.get('#cdk-overlay-2').within(($menu)=>{
            cy.get('.mat-menu-item').contains('Logout').click()
        })


    })
})
