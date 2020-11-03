/// <reference types="cypress" />
import { environment } from '../cypress.env'
const randomUser = require('../helpers/randomUser')
const urlMatch = require('../helpers/urlMatch')
const oauthUrlBuilder = require('../helpers/oauthUrlBuilder')

describe('Oauth life cycles', () => {
  // TEST SIMPLE OAUTH
  let justRegisteredUser
  describe('Register and authorize', () => {
    it('use an Oauth request that comes with an unregistered email and names', () => {
      const userToRegister = randomUser()
      let oauthParams = {
        client_id: environment.validApp.id,
        response_type: 'code',
        scope: '/authenticate openid',
        redirect_uri: environment.validApp.redirectUrl,
        email: environment.notYetRegisteredUser.email,
        family_names: environment.notYetRegisteredUser.familyNames,
        given_names: environment.notYetRegisteredUser.givenNames,
      }

      let oauthParamsUrl = oauthUrlBuilder(oauthParams)

      let expectedPreFillRegister = {
        givenNames: environment.notYetRegisteredUser.givenNames,
        familyNames: environment.notYetRegisteredUser.familyNames,
        email: environment.notYetRegisteredUser.email,
      }

      let expectedAuthorizationScreen = {
        displayName: userToRegister.name + ' ' + userToRegister.familyName,
        appName: environment.validApp.name,
        scopes: ['openid'],
      }

      let expectRegrowEvent = {
        category: 'New-Registration',
        memberName: environment.validApp.name,
        clientName: environment.validApp.memberName,
      }

      let expectRedirectUrl = {
        url: environment.validApp.redirectUrl,
        urlParameters: { code: Cypress.sinon.match.string },
      }

      cy.visit(`${environment.baseUrl}/oauth/authorize${oauthParamsUrl}`, {
        onBeforeLoad: (win) => {
          win.outOfRouterNavigation = () => {}
          cy.stub(win, 'outOfRouterNavigation')
        },
      })
        // TODO: test different entry points
        .expectGtagInitialization(`/register${oauthParamsUrl}&oauth`)
        .hasNoLayout()
        .hasNoZendesk()
        .expectPreFillRegister(expectedPreFillRegister)
        .registerUser(userToRegister)
        .expectAuthorizeScreen(expectedAuthorizationScreen)
        .expectGtagNavigation(`/oauth/authorize${oauthParamsUrl}&oauth`)
        .hasNoLayout()
        .hasNoZendesk()
        .expectGtagRegrow(expectRegrowEvent)
        // TODO: test Gtag event to scope after the recently requested changes to those events are ready
        // TODO: test deny access
        .get('#authorize-button')
        .click()
        .get('#loading-bar')
        .window()
        .its('outOfRouterNavigation')
        .should('be.calledWith', urlMatch(expectRedirectUrl))
      justRegisteredUser = userToRegister
    })

    it('use an Oauth request that comes with no user data', () => {
      const registeringUser = randomUser()
      let oauthParams = {
        client_id: environment.validApp.id,
        response_type: 'code',
        scope: '/authenticate openid',
        redirect_uri: environment.validApp.redirectUrl,
      }

      let oauthParamsUrl = oauthUrlBuilder(oauthParams)

      let expectedPreFillRegister = {}

      let expectedAuthorizationScreen = {
        displayName: registeringUser.name + ' ' + registeringUser.familyName,
        appName: environment.validApp.name,
        scopes: ['openid'],
      }

      let expectRegrowEvent = {
        category: 'New-Registration',
        memberName: environment.validApp.name,
        clientName: environment.validApp.memberName,
      }

      let expectRedirectUrl = {
        url: environment.validApp.redirectUrl,
        urlParameters: { code: Cypress.sinon.match.string },
      }

      cy.visit(`${environment.baseUrl}/oauth/authorize${oauthParamsUrl}`, {
        onBeforeLoad: (win) => {
          win.outOfRouterNavigation = () => {}
          cy.stub(win, 'outOfRouterNavigation')
        },
      })
        .expectGtagInitialization(`/signin${oauthParamsUrl}&oauth`)
        .hasNoLayout()
        .hasNoZendesk()
        .get('#register-button')
        .click()
        .expectGtagNavigation(`/register${oauthParamsUrl}&oauth`)
        .hasNoLayout()
        .hasNoZendesk()
        .expectPreFillRegister(expectedPreFillRegister)
        .registerUser(registeringUser)
        .expectAuthorizeScreen(expectedAuthorizationScreen)
        .expectGtagNavigation(`/oauth/authorize${oauthParamsUrl}&oauth`)
        .hasNoLayout()
        .hasNoZendesk()
        .expectGtagRegrow(expectRegrowEvent)
        .get('#authorize-button')
        .click()
        .get('#loading-bar')
        .window()
        .its('outOfRouterNavigation')
        .should('be.calledWith', urlMatch(expectRedirectUrl))
    })
  })
  describe('Signing and authorize', () => {
    //TODO: add a programmatically register command to avoid depending on reusing a user register on a previous test.

    it('use an Oauth request that comes with an register email', () => {
      let oauthParams = {
        client_id: environment.validApp.id,
        response_type: 'code',
        scope: '/authenticate openid',
        redirect_uri: environment.validApp.redirectUrl,
        email: justRegisteredUser.email,
        family_names: justRegisteredUser.familyName,
        given_names: justRegisteredUser.name,
      }

      let expectedPreFilledSignin = {
        username: justRegisteredUser.email,
      }

      let oauthParamsUrl = oauthUrlBuilder(oauthParams)

      cy.visit(`${environment.baseUrl}/oauth/authorize${oauthParamsUrl}`, {
        onBeforeLoad: (win) => {
          win.outOfRouterNavigation = () => {}
          cy.stub(win, 'outOfRouterNavigation')
        },
      })
        .expectGtagInitialization(`/signin${oauthParamsUrl}&oauth`)
        .expectPreFillSignin(expectedPreFilledSignin)
        .hasNoLayout()
        .hasNoZendesk()
    })
  })
  describe('Forgot password and authorize', () => {})
  describe('Social sign-in and authorize', () => {
    //TODO links account and authorize
  })
  describe('Institutional sign-in and authorize', () => {})
  describe('Open a Oauth url and then forget about it', () => {
    it('While NOT been signed in', function () {
      const oauthParams = oauthUrlBuilder({
        client_id: environment.validApp.id,
        response_type: 'code',
        scope: '/authenticate openid',
        redirect_uri: environment.validApp.redirectUrl,
        family_names: environment.notYetRegisteredUser.familyNames,
        given_names: environment.notYetRegisteredUser.givenNames,
      })
      cy.visit(`${environment.baseUrl}/oauth/authorize${oauthParams}`)
      cy.get('app-form-sign-in')
      cy.hasNoLayout()
      cy.hasZendesk()
      cy.visit(`${environment.baseUrl}`)
      cy.hasLayout()
      cy.hasZendesk()

      cy.visit(`${environment.baseUrl}` + '/signin')
      cy.hasLayout()
      cy.hasZendesk()

      cy.visit(`${environment.baseUrl}` + '/register')
      cy.hasLayout()
      cy.hasZendesk()
      cy.expectPreFillRegister({})

      cy.visit(`${environment.baseUrl}` + '/reset-password')
      cy.hasLayout()
      cy.hasZendesk()
    })
    it('While been signed in', function () {
      const oauthParams = oauthUrlBuilder({
        client_id: environment.validApp.id,
        response_type: 'code',
        scope: '/authenticate openid',
        redirect_uri: environment.validApp.redirectUrl,
        family_names: environment.notYetRegisteredUser.familyNames,
        given_names: environment.notYetRegisteredUser.givenNames,
      })
      cy.sessionLogin('testUser')
      cy.visit(`${environment.baseUrl}/oauth/authorize${oauthParams}`)
      cy.get('mat-card-title').contains('Authorize access')

      cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(4))
      cy.hasNoLayout()
      cy.hasZendesk()

      cy.visit(`${environment.baseUrl}`)
      cy.hasLayout()
      cy.hasZendesk()

      cy.visit(`${environment.baseUrl}` + '/signin')
      cy.hasLayout()
      cy.hasZendesk()

      cy.visit(`${environment.baseUrl}` + '/register')
      cy.hasLayout()
      cy.hasZendesk()
      cy.expectPreFillRegister({})

      cy.visit(`${environment.baseUrl}` + '/reset-password')
      cy.hasLayout()
      cy.hasZendesk()
    })
  })
  describe('Handle server error', () => {
    it('oauth/custom/init.json endpoint', function () {
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
