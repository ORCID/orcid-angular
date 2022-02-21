/// <reference types="cypress" />
const randomUser = require('../../helpers/randomUser')

describe('Register new user', async function() {
    beforeEach(() => {
      cy.visit('/')
    })
  
    //Register new user with all valid data
    it('New user registers and verifies primary email', function() { 

      // Bypass the duplicated research call to avoid getting the "Is this you modal"
      cy.intercept('GET', Cypress.env('duplicatedModalEndPoint'), [])
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
      cy.get('.mat-card-title').contains("Create your ORCID iD")
      cy.get('#password-input').clear().type(userToRegister.password)
      cy.get('#password-confirm-input').clear().type(userToRegister.password)
      cy.get('.ng-valid #step-b-next').click()
        
      //STEP 3/3 
      cy.get('#visibility-everyone-input-input').click({ force: true })
      cy.get('#privacy-input-input').check({ force: true }).should('be.checked')
      cy.get('#data-processed-input-input').check({ force: true }).should('be.checked')
      
      //CAPTCHA
      // Wrap iframe body into a cypress object and perform test within there
      cy.getIframeBody('iframe').within(() => {
        cy.get('.recaptcha-checkbox-border').click()
        cy.get('#recaptcha-anchor', { timeout: 10000 }).should(
          'have.class',
          'recaptcha-checkbox-checked'
        )
      })
      cy.get('#step-c-register-button').click()
      cy.wait(10000)//wait 10 secs before checking for the email

      //use gmail api to check verification email was sent
      cy.task("readAllMessages", {
        options: {
          from: Cypress.env('senderVerifyEmail'),
          to: userToRegister.email,
          subject: Cypress.env('verifyEmailSubject'),
          include_body: true,
          //before: new Date(2022, 12, 24, 12, 31, 13), // Before December 24rd, 2022 12:31:13
          //after: new Date(2022, 1, 15, 12, 31, 13) // After Jan 15, 2022
        }
      }).then(emails => {
          //there may be multiple emails with same subject and sender
          assert.isNotNull(emails.length)
          
          //grab most recent email
          const emailBody = emails[0].body.html
          cy.log(">>>>>>>>>Email body is: "+ JSON.stringify(emails[0].body))
         
          //convert string to DOM
          const htmlDom = new DOMParser().parseFromString(emailBody, 'text/html')
          cy.log(htmlDom.documentElement.innerHTML)
          //find the link
          const href= htmlDom.querySelector('[id$="verificationButton"]').href
          cy.log(">>>>>>>found the link: "+ href)
         
          // make an api request for this resource (no UI needed)
          // drill into the response to check it was successful       
          cy.request(href).its('status').should('eq', 200)
        })

      //reload page
      cy.reload()

      //try editing Bio which only users with verified emails can do
      cy.get('#biography-panel').within(($bioSection)=>{
        cy.get('#edit-button').click()
      })
      cy.get('#biography-input').clear().type('only users with verified emails can edit bio')
      cy.get('#save-biography-button').click()
      cy.get('#biography').contains('only users with verified emails can edit bio')

      //sign out
      cy.get('app-user-menu').click()
      cy.get('#cdk-overlay-2').within(($menu)=>{
        cy.get('.mat-menu-item').contains('Logout').click()
      })
  }) 
      
})    
    


// //Register new user negative testing - verify error messages for the form
// it.skip('New user registers via Sign in button - negative testing', () => {   
//    })
