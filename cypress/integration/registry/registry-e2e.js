/// <reference types="cypress" />
//import { environment } from '../cypress/cypress.env'
const randomUser = require('../../helpers/randomUser')

describe('Register new user', async function() {
    beforeEach(() => {
      cy.visit('/')
    })
  
    //Register new user with all valid data
    it('New user registers via Sign in button - happy path', function() { 

    // Bypass the duplicated research call to avoid getting the "Is this you modal"
     cy.intercept('GET', 'https://pub.qa.orcid.org/v3.0/expanded-search/**', [])
      //generate a new (random) user
      const userToRegister = randomUser()

        cy.get('#menu-signin-button').click()
        //verify user is redirected to the sign in page
        cy.url().should('include', '/signin') 
        cy.get('#register-button').click()
         //verify user is redirected to the register page
        cy.url().should('include', '/register')
        
        //STEP 1/3 populate form
        cy.get('#given-names-input').clear().type(userToRegister.name)
        cy.get('#family-names-input').clear().type(userToRegister.familyName)
        cy.get('#email-input').clear().type(userToRegister.email)
        cy.get('#confirm-email-input').clear().type(userToRegister.email)
        cy.get('#step-a-next-button').click()

        //STEP 2/3 create OID
       // cy.wait('@duplicateResearcher')//wait to intercept the modal
        cy.get('.mat-card-title').contains("Create your ORCID iD")
        cy.get('#password-input').clear().type(userToRegister.password)
        cy.get('#password-confirm-input').clear().type(userToRegister.password)
        cy.get('.ng-valid #step-b-next').click()
        
        //STEP 3/3 
        cy.get('#visibility-everyone-input-input').click({ force: true })
        cy.get('#privacy-input-input').check({ force: true }).should('be.checked')
        cy.get('#data-processed-input-input').check({ force: true }).should('be.checked')
        
        // Wrap iframe body into a cypress object and perform test within there
        cy.getIframeBody('iframe').within(() => {
          cy.get('.recaptcha-checkbox-border').click()
          cy.get('#recaptcha-anchor', { timeout: 10000 }).should(
            'have.class',
            'recaptcha-checkbox-checked'
          )
        })
        cy.get('#step-c-register-button').click()
        cy.wait(5000)//wait 5 secs before checking for the email

        //use gmail api to check verification email was sent
        cy
          .task("gmail:check", {
            from: "support@verify.orcid.org",
            to: userToRegister.email,
            subject: "Welcome to ORCID - verify your email address"
          })
          .then(email => {
            assert.isNotNull(email, `Verification email was not found`);
          });



    })

})
/*describe("Email verification for registered user", async function() {
    it("Register Form: Email is delievered", function() {
      const test_id = new Date().getTime();
      const incoming_mailbox = `orcidqa+${test_id}@gmail.com`;
      cy
        .task("gmail:check", {
          from: "support@verify.orcid.org",
          to: incoming_mailbox,
          subject: "Welcome to ORCID - verify your email address"
        })
        .then(email => {
          assert.isNotNull(email, `Verification email was found`);
        });
    });
  });*/
  
/*
//Register new user negative testing - verify error messages for the form
it.skip('New user registers via Sign in button - invalid data', () => {   
   
})
*/