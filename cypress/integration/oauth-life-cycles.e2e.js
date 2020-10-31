/// <reference types="cypress" />
import { environment } from '../cypress.env'
const regExpEscape = require('../helpers/regExpEscape')
const randomUser = require('../helpers/randomUser')

describe('Oauth life cycles', () => {
  // TEST SIMPLE OAUTH

  describe.only('Handle request with unregistered email', () => {
    const user = randomUser()
    before(() => {
      cy.clearCookies()
    })
    beforeEach(() => {
      Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
    })
    after(() => {
      cy.clearCookies()
    })
    it.only('sends Oauth request with unregistered email to an auto-filled register page', function () {
      const oauthParams = `client_id=${environment.validApp.id}&response_type=code&scope=%2Fauthenticate%20openid&redirect_uri=${environment.validApp.redirectUrl}&email=${environment.notYetRegisteredUser.email}&family_names=${environment.notYetRegisteredUser.familyNames}&given_names=${environment.notYetRegisteredUser.givenNames}`
      cy.visit(`${environment.baseUrl}/oauth/authorize?${oauthParams}`, {
        onBeforeLoad: (win) => {
          win.outOfRouterNavigation = () => {}
          cy.stub(win, 'outOfRouterNavigation')
        },
      })
        .expectGtagInitialization(`/register?${oauthParams}`)
        .hasNoLayout()
        .hasNoZendesk()
        .get('#given-names-input')
        .should('have.value', environment.notYetRegisteredUser.givenNames)
        .get('#family-names-input')
        .should('have.value', environment.notYetRegisteredUser.familyNames)
        .get('#email-input')
        .should('have.value', environment.notYetRegisteredUser.email)
        .registerUser(user)
        .expectAuthorizeScreen({
          displayName: user.name + ' ' + user.familyName,
          appName: environment.validApp.name,
          scopes: ['openid'],
        })
        .hasNoLayout()
        .hasNoZendesk()
        .expectGtagNavigation(`/oauth/authorize?${oauthParams}`)
        .expectGtagRegrow({
          category: 'New-Registration',
          memberName: environment.validApp.name,
          clientName: environment.validApp.memberName,
        })
        .get('#authorize-button')
        .click()
        .window()
        .its('outOfRouterNavigation')
        .should(
          'be.calledWith',
          Cypress.sinon.match(
            new RegExp(
              regExpEscape(environment.validApp.redirectUrl) +
                `\?code=[a-zA-Z0-9]{6}`
            )
          )
        )

      // TODO on local environments the following might be 8 since the check duplicates will fail
      //.get(`@ga`).then((value) => expect(value.callCount).to.be.eq(7))
    })
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
      cy.get('#given-names-input').should('be.empty')
      cy.get('#family-names-input').should('be.empty')
      cy.get('#email-input').should('be.empty')

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
    it('shows an authorization screen', function () {
      cy.visit(
        `${environment.baseUrl}/oauth/authorize?client_id=${environment.validApp.id}&response_type=code&scope=%2Fauthenticate%20openid&redirect_uri=${environment.validApp.redirectUrl}&family_names=${environment.notYetRegisteredUser.familyNames}&given_names=${environment.notYetRegisteredUser.givenNames}`
      )
      cy.get('mat-card-title').contains('Authorize access')

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
      cy.get('#given-names-input').should('be.empty')
      cy.get('#family-names-input').should('be.empty')
      cy.get('#email-input').should('be.empty')

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
