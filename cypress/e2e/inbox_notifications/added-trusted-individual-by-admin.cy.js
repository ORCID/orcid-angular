/// <reference types="cypress" />

import inboxNotifUsers from '../../fixtures/inboxNotif-users.fixture.json'
import otherUsers from  '../../fixtures/testing-users.fixture.json'

describe('Inbox: added as trusted individual by an admin user', async function () {
    
    before(() => {
        cy.visit(Cypress.env('signInURL'))
        //admin logs in
        cy.task("generateOTP", Cypress.env('cy_admin_secret')).then(token => {
            cy.signin2FA(token)
        })
        //admin adds record as trusted party
        cy.get('#cy-user-info').click()
        cy.get('#cy-admin-actions').wait(1000).click({ force: true })
        cy.contains('Trusted Individuals').click()
        cy.get('#managed').clear().type(otherUsers.cyAcctSettVisibilityUser.oid)
        cy.get('#trusted').clear().type(inboxNotifUsers.cyNotifPerm.oid)
        cy.get('#bottom-confirm-delegate-profile').click()
        cy.wait(2000)
        //FIX pending: ideally admin user logs out before next steps
       
    })

    it('Admin user adds X as trsuted individual for Y: Y receives notification and confirms, then X receives notification.', () =>  {
        cy.visit(Cypress.env('signInURL'))
        cy.contains('Not you?').click() //remove once the admin is able to log out in the before hook
        cy.wait(2000)
        //log in record owner
        cy.signin(otherUsers.cyAcctSettVisibilityUser)
        //go check the inbox has the corresponding notification
        cy.get('#cy-user-info').click()
        cy.get('#cy-inbox').wait(1000).click({ force: true })
        cy.get('app-notification').contains('YOUR RECORD').click()
        cy.contains('https://qa.orcid.org/account/authorize-delegates?').should('be.visible')
        cy.contains('https://qa.orcid.org/account/authorize-delegates?')
        .should('have.attr', 'href')
        .then((href) => {
          cy.visit(href)
        })
        //go check the inbox has the corresponding notification
        cy.wait(3000).get('#cy-user-info').click({ force: true })
        cy.get('#cy-inbox').wait(1000).click({ force: true })
        cy.get('[class="control-container"]').within(() => {
            cy.get('mat-checkbox').click()
        })
       //log out record owner
       cy.get('#cy-user-info').click({ force: true })
       cy.get('#cy-signout').click({ force: true })

       //sign in account delegate
       cy.signin(inboxNotifUsers.cyNotifPerm)
        //go check the inbox has the corresponding notification
        cy.get('#cy-user-info').click()
        cy.get('#cy-inbox').wait(1000).click({ force: true })
        cy.get('app-notification').contains('YOUR RECORD').click()
        cy.contains('You have been made an Account Delegate by').should('be.visible')
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
