/// <reference types="cypress" />
import { environment } from '../cypress.env'

describe('Oauth life cycles', () => {
  // TEST SIMPLE OAUTH

  describe('Handle request with unregistered email', () => {
    beforeEach(() => {
      Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
    })
    after(() => {
      cy.clearCookies()
    })
    it('sends Oauth request with unregistered email to an auto-filled register page', function () {
      cy.visit(
        `${environment.baseUrl}/oauth/authorize?client_id=${environment.validApp.id}&response_type=code&scope=%2Fauthenticate%20openid&redirect_uri=${environment.validApp.redirectUrl}&email=${environment.notYetRegisteredUser.email}&family_names=${environment.notYetRegisteredUser.familyNames}&given_names=${environment.notYetRegisteredUser.givenNames}`
      )
      cy.get('#givenNamesInput').should(
        'have.value',
        environment.notYetRegisteredUser.givenNames
      )
      cy.get('#familyNamesInput').should(
        'have.value',
        environment.notYetRegisteredUser.familyNames
      )
      cy.get('#emailInput').should(
        'have.value',
        environment.notYetRegisteredUser.email
      )
      cy.hasNoLayout()
      cy.hasZendesk()
    })
    it('remove Oauth parameters and expect to forget the Oauth session', function () {
      cy.visit(`${environment.baseUrl}`)
      cy.hasLayout()
      cy.hasZendesk()

      cy.visit(`${environment.baseUrl}` + '/signin')
      cy.hasLayout()
      cy.hasZendesk()

      cy.visit(`${environment.baseUrl}` + '/register')
      cy.hasLayout()
      cy.hasZendesk()

      cy.visit(`${environment.baseUrl}` + '/reset-password')
      cy.hasLayout()
      cy.hasZendesk()
    })
    // TODO
    it('register user using the autofill form and end on the authorization page', function () {})
    after(() => {
      cy.clearCookies()
    })
  })
  describe('Open a Oauth url and then forget about it (NOT signed in)', () => {
    beforeEach(() => {
      Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
    })
    after(() => {
      cy.clearCookies()
    })
    it('shows an Oauth signing screen', function () {
      cy.visit(
        `${environment.baseUrl}/oauth/authorize?client_id=${environment.validApp.id}&response_type=code&scope=%2Fauthenticate%20openid&redirect_uri=${environment.validApp.redirectUrl}&family_names=${environment.notYetRegisteredUser.familyNames}&given_names=${environment.notYetRegisteredUser.givenNames}`
      )
      cy.get('app-form-sign-in')
      cy.hasNoLayout()
      cy.hasZendesk()
    })
    it('remove Oauth parameters and expect to forget the Oauth session', function () {
      cy.visit(`${environment.baseUrl}`)
      cy.hasLayout()
      cy.hasZendesk()

      cy.visit(`${environment.baseUrl}` + '/signin')
      cy.hasLayout()
      cy.hasZendesk()

      cy.visit(`${environment.baseUrl}` + '/register')
      cy.hasLayout()
      cy.hasZendesk()
      cy.get('#givenNamesInput').should('be.empty')
      cy.get('#familyNamesInput').should('be.empty')
      cy.get('#emailInput').should('be.empty')

      cy.visit(`${environment.baseUrl}` + '/reset-password')
      cy.hasLayout()
      cy.hasZendesk()
    })
    after(() => {
      cy.clearCookies()
    })
  })
  describe('Open a Oauth url and then forget about it (signed in)', () => {
    before(() => {
      cy.sessionLogin('testUser')
    })

    beforeEach(() => {
      Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
    })

    after(() => {
      cy.clearCookies()
    })
    it('shows an "open id" authorization screen with user data', function () {
      cy.visit(
        `${environment.baseUrl}/oauth/authorize?client_id=${environment.validApp.id}&response_type=code&scope=%2Fauthenticate%20openid&redirect_uri=${environment.validApp.redirectUrl}&family_names=${environment.notYetRegisteredUser.familyNames}&given_names=${environment.notYetRegisteredUser.givenNames}`
      )
      cy.get('mat-card-title').contains('Authorize access')
      cy.get('#user-name').contains(environment.testUser.displayName)
      cy.get('#app-name').contains(environment.validApp.name)
      cy.get('li#openid')
      cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(4))
      cy.hasNoLayout()
      cy.hasZendesk()
    })
    it('remove Oauth parameters and expect to forget the Oauth session', function () {
      cy.visit(`${environment.baseUrl}`)
      cy.hasLayout()
      cy.hasZendesk()

      cy.visit(`${environment.baseUrl}` + '/signin')
      cy.hasLayout()
      cy.hasZendesk()

      cy.visit(`${environment.baseUrl}` + '/register')
      cy.get('#givenNamesInput').should('be.empty')
      cy.get('#familyNamesInput').should('be.empty')
      cy.get('#emailInput').should('be.empty')

      cy.visit(`${environment.baseUrl}` + '/reset-password')
      cy.hasLayout()
      cy.hasZendesk()
    })
    after(() => {
      cy.clearCookies()
    })
  })

  describe('Handle server issues', () => {
    it('reports fatal SERVER ERROR on oauth/custom/init.json endpoint', function () {
      cy.server()
      cy.route({
        method: 'POST',
        url: '/oauth/custom/**',
        response: 'badResponse',
        status: 500,
      })
      cy.visit(
        `${environment.baseUrl}/oauth/authorize?client_id=${environment.validApp.id}&response_type=code&scope=%2Fauthenticate%20openid&redirect_uri=${environment.validApp.redirectUrl}`
      )
      cy.contains(`Oh no! An error occurred`)
      cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(3))
    })
  })
})
