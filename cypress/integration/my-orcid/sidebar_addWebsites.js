/// <reference types="cypress" />

const randomUser = require('../../helpers/randomUser')
import userData from '../../fixtures/testing_users.json'

describe('My orcid - users are able to add content to their record', async function() {

    before(() => {
        cy.visit(Cypress.env('signInURL'))
        //sign in
        cy.signin(userData.cyUser_primaryEmaiVerified)
        cy.wait(1000)

    })
    
    it('User adds secondary Email to their record', function() { 
        const addDesc="Testing new website"
        const addUrl="https://www.nationalgeographic.com/"

        //click on edit pencil for Emails section
        cy.get('#websites-panel').within(($myPanel)=>{
            cy.get('#edit-button').click()
        })
        
        cy.get('#add-link').click()
        
        cy.get('#description-input').clear().type(addDesc)
        cy.get('#url-input').clear().type(addUrl)
        cy.get('#save-websites-button').click()
        cy.wait(1000)
        
        //verify the keyword is displayed  
        cy.get('#websites-panel').within(($section)=>{
            cy.get('[class="line"]')
        }).should('contain',addDesc)

        //clean up state
        cy.cleanWebsites()

       //sign out
        cy.get('app-user-menu').click()
        cy.get('#cdk-overlay-2').within(($menu)=>{
            cy.get('.mat-menu-item').contains('Logout').click()
        })

    })    
   
})
