import { testStore } from '../../support/index.js'
describe('"Manual" QA Tests', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
  })
  const name = 'verifiedchecking'
  /*it('the new 2', () => {
  cy.visit("https://qa.orcid.org/my-orcid")
  cy.get('input[formcontrolname="username"]')
    .type(name + '@mailinator.com')
    .should('have.value', name + '@mailinator.com')
  cy.get('input[formcontrolname="password"]')
    .type('test1234')
    .should('have.value', 'test1234')
    .and('have.attr', 'type', 'password')
  cy.get('button[type="submit"]')
    .click()
})

it ('get id', () => {
  cy.get('#orcid-id')
    .invoke('text')
    .then((orcid) => {
      cy.writeFile('orcid.txt', orcid)
    })
    
    }) 
    it('Sign out', () => {
      cy.get('user-menu')
        .click()
      cy.get('a:visible')
        .filter('[href="https://qa.orcid.org/signout"]')
        .click()
    }) 
    

context('Password reset procedure', () => {
  it('Find and click the "Forgot your password or ORCID ID?" button', () => {
    cy.get('a:visible')
      .contains('Forgot your password or ORCID ID?')
      .click()
    cy.wait(1000)
    })
  it('Request password reset link', () => {
    cy.get('input:visible')
      .filter('[formcontrolname="email"]')
      .type(name + '@mailinator.com')
      .should('have.value', name + '@mailinator.com')
    cy.get('button:visible')
      .filter('[type="submit"]')
      .click()    
    })
    it('Reload', () => {
      cy.reload()
    })
    it('Request ORCID iD', () => {
      cy.get('mat-chip:visible')
        .filter('[value="remindOrcidId"]')
        .click()
      cy.get('input:visible')
        .filter('[formcontrolname="email"]')
        .type(name + '@mailinator.com')
        .should('have.value', name + '@mailinator.com')
      cy.get('button:visible')
        .filter('[type="submit"]')
        .click()
    })
  })
  
  context('Mailinator tests', () => {    
    it('Sign into Mailinator and check that the "About your ORCID iD" message is present', () => {
      cy.visit('https://www.mailinator.com/v3/index.jsp?zone=public&query=' + name + '#/#inboxpane')
      cy.get('tbody:visible')
        .find('a')
        .contains("Your ORCID iD")

    })  
    it('Open the reset password message', () => {
      cy.get('tbody')
        .children()
        .contains('About your password reset request')
        .click(100, 15)
    })
    it('Fetch the verification link', () => {
      cy.getIframeBody('iframe').find('a')
        .contains('qa.orcid.org/reset-password-email')
        .should('have.attr', 'href')
        .then((href) => {
          cy.writeFile('link.txt', href)
        })       
    })
  })
  */
  /**
   * Change 'name + 1234' to 'name' once captcha is fixed
   */
  context('Mailinator tests', () => {
    it('Reset password', () => {
      cy.readFile('link.txt').then((href) => {
        cy.visit(href)
      })
      cy.get('#passwordField').type(name + '1234')
      cy.get('#retypedPassword').type(name + '1234')
      cy.get('button:visible').contains('Save changes').click()
    })

    it('Sign in using new credentials', () => {
      cy.get('input[formcontrolname="username"]')
        .type(name + '@mailinator.com')
        .should('have.value', name + '@mailinator.com')
      cy.get('input[formcontrolname="password"]')
        .type(name + '1234')
        .should('have.value', name + '1234')
        .and('have.attr', 'type', 'password')
      cy.get('button[type="submit"]').click()
    })

    it('Sign out', () => {
      cy.get('user-menu').click()
      cy.get('a:visible')
        .filter('[href="https://qa.orcid.org/signout"]')
        .click()
    })
  })
})
