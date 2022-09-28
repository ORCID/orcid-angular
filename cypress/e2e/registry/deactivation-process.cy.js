// <reference types="cypress" />
import userData from '../../fixtures/testing-users.fixture.json'

/* 
    Deactivation scenarios
*/

describe('deactivation process', async function () {
  var deactLink=''

  before(() => {})

  it('deactivation process - user signed in', function () {
    /*
    1. Sign in
    2. go to account settings
    3. request deactivation link
    Expect: user receives email in primary email
    Expect: confirmation banner is displayed in account settings page
    4. visit deactivation link
    Expect: user is taken to /signin
    Expect: account is deactivated
    */
    const recordOwner = userData.cyRecordDeactivation1
    
    cy.visit('/signin')
    cy.url({ timeout: 40000 }).should('include', Cypress.env('signInURL'))
    cy.signin(recordOwner)
    cy.get('#cy-user-info').click({force:true})
    //wait for menu overlay to be displayed
    cy.wait(4000)
    cy.get('#cy-account-settings').click({force:true})
    cy.url().should('include', '/account')
    cy.get('#cy-deactivate-account-panel-action-more').click()
    cy.get('#cy-deactivate-account').click()
    //cy.wait(4000)//wait to receive email
    //use gmail api to check deactvation link was sent
    cy.task('checkInbox_from_to_subject', {
      options: {
        from: Cypress.env('deactivationEmailSender'),
        to: recordOwner.email,
        subject: Cypress.env('deactivationEmailSubject'),
        include_body: true,
      },
    }).then((email) => {
      assert.isNotNull(email)
      const emailBody = email.body.html
      //convert string to DOM
      const htmlDom = new DOMParser().parseFromString(emailBody, 'text/html')
      //find the link that points to the correct endpoint
      deactLink = htmlDom.querySelector(
        `a[href*="account/confirm-deactivate-orcid"]`
      ).href
      cy.log('link found in email: '+ deactLink)
      //verify message banner is displayed
      cy.get('#cy-deactivate-account-panel').should('contain',Cypress.env('deactivationBannerMessage'))
      cy.visit(deactLink)
      cy.url({ timeout: 40000 }).should('include', Cypress.env('signInURL'))
      cy.signin(recordOwner)
      cy.get('app-deactivated').should('contain', Cypress.env('deactivatedRecordMessage'))
    })
  })

  it.skip('deactivation process - user signed out', function () {
   /*
    1. Sign in
    2. go to account settings
    3. request deactivation link
    Expect: user receives email in primary email
    Expect: confirmation banner is displayed in account settings page
    4. Sign out
    5. visit deactivation link
    Expect: user is taken to /signin
    Expect: account is deactivated
    */
    const recordOwner = userData.cyRecordDeactivation2

    cy.visit('/signin')
    cy.url({ timeout: 40000 }).should('include', Cypress.env('signInURL'))
    cy.signin(recordOwner)
    cy.get('#cy-user-info').click({force:true})
    //wait for menu overlay to be displayed
    cy.wait(4000)
    cy.get('#cy-account-settings').click({force:true})
    cy.url().should('include', '/account')
    cy.get('#cy-deactivate-account-panel-action-more').click()
    cy.get('#cy-deactivate-account').click()
    //use gmail api to check deactvation link was sent
    cy.task('checkInbox_from_to_subject', {
      options: {
        from: Cypress.env('deactivationEmailSender'),
        to: recordOwner.email,
        subject: Cypress.env('deactivationEmailSubject'),
        include_body: true,
      },
    }).then((email) => {
      assert.isNotNull(email)
      const emailBody = email.body.html
      //convert string to DOM
      const htmlDom = new DOMParser().parseFromString(emailBody, 'text/html')
      //find the link that points to the correct endpoint
      deactLink = htmlDom.querySelector(
        `a[href*="account/confirm-deactivate-orcid"]`
      ).href
      cy.log('link found in email: '+ deactLink)
      //verify message banner is displayed
      cy.get('#cy-deactivate-account-panel').should('contain',Cypress.env('deactivationBannerMessage'))
      
      //SIGN OUT
      cy.get('#cy-user-info').click()
      cy.get('#cy-signout').click({ force: true })

      cy.visit(deactLink)
      cy.url({ timeout: 40000 }).should('include', Cypress.env('signInURL')) 
      cy.signin(recordOwner)     
      cy.get('app-deactivated').should('contain', Cypress.env('deactivatedRecordMessage'))
    })
  })

  after(() => {})
})
