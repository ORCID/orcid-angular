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
    
    it('User changes visibility to the primary email account', function() { 
        
        //click on edit pencil for Emails section
        cy.get('#emails-panel').within(($myPanel)=>{
            cy.get('#edit-button').click()
        })
        
         //set visibility to public
         //FIX: use id instead of class so it doesnt fail if the record is already public
        cy.get('button[class="mat-focus-indicator public-button mat-icon-button mat-button-base no-selected"]').click()

        //save changes
        cy.get('#save-emails-button').click()
        cy.wait(3000)
       
        cy.get('app-panel-privacy').should('have.attr', 'aria-label','PUBLIC')

        //sign out
        cy.get('app-user-menu').click()
        cy.get('#cdk-overlay-2').within(($menu)=>{
            cy.get('.mat-menu-item').contains('Logout').click()
        })

    })    
   
})
