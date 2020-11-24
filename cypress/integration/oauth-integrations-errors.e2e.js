/// <reference types="cypress" />
import { environment } from '../cypress.env'
const oauthUrlBuilder = require('../helpers/oauthUrlBuilder')
const runInfo = require('../helpers/runInfo')

describe('Oauth integrations errors' + runInfo(), () => {
  before(() => {
    cy.clearCookies()
    cy.programmaticSignin('testUser')
  })
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
  })

  after(() => {
    cy.clearCookies()
  })

  it('Has no detectable a11y critical or serious violations', () => {
    cy.visit(
      `${environment.baseUrl}/oauth/authorize` +
        oauthUrlBuilder({
          client_id: 'WRONG',
          response_type: 'code',
          scope: `/authenticate openid`,
          redirect_uri: environment.validApp.redirectUrl,
        })
    )
    cy.injectAxe()
      .get('#error-message')
      .checkA11y(null, {
        includedImpacts: ['critical', 'serious'],
      })
  })

  it('show error screen on INVALID client id', function () {
    cy.visit(
      `${environment.baseUrl}/oauth/authorize` +
        oauthUrlBuilder({
          client_id: 'WRONG',
          response_type: 'code',
          scope: `/authenticate openid`,
          redirect_uri: environment.validApp.redirectUrl,
        })
    )
    cy.get('#error-message').contains(
      'Error: The provided client id WRONG is invalid.'
    )
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(5))
    cy.hasNoLayout()
    cy.hasZendesk()
  })

  it('show error screen on MISSING client id', function () {
    cy.visit(
      `${environment.baseUrl}/oauth/authorize` +
        oauthUrlBuilder({
          client_id: undefined,
          response_type: 'code',
          scope: `/authenticate openid`,
          redirect_uri: environment.validApp.redirectUrl,
        })
    )
    cy.get('#error-message').contains(
      'Error: Incorrect OAuth Link, missing client id parameter.'
    )
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(5))
    cy.hasNoLayout()
    cy.hasZendesk()
  })
  it('show error screen on LOCKED client id', function () {
    cy.visit(
      `${environment.baseUrl}/oauth/authorize` +
        oauthUrlBuilder({
          client_id: environment.lockedApp.id,
          response_type: 'code',
          scope: `/authenticate openid`,
          redirect_uri: environment.validApp.redirectUrl,
        })
    )
    cy.get('#error-message').contains(
      `Error: The provided client id ${environment.lockedApp.id} is locked.`
    )
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(5))
    cy.hasNoLayout()
    cy.hasZendesk()
  })
  it('show error screen on INVALID response type', function () {
    cy.visit(
      `${environment.baseUrl}/oauth/authorize` +
        oauthUrlBuilder({
          client_id: environment.validApp.id,
          response_type: 'WRONG',
          scope: `/authenticate openid`,
          redirect_uri: environment.validApp.redirectUrl,
        }),
      {
        onBeforeLoad(win) {
          win.outOfRouterNavigation = () => {}
          cy.stub(win, 'outOfRouterNavigation')
        },
      }
    )
    cy.window()
      .its('outOfRouterNavigation')
      .should(
        'be.calledWith',
        `${environment.validApp.redirectUrl}` +
          `#error=unsupported_response_type`
      )
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(2))
  })
  it('show error screen on MISSING response type', function () {
    cy.visit(
      `${environment.baseUrl}/oauth/authorize` +
        oauthUrlBuilder({
          client_id: environment.validApp.id,
          response_type: undefined,
          scope: `/authenticate openid`,
          redirect_uri: environment.validApp.redirectUrl,
        })
    )
    cy.get('#error-message').contains(
      `Error: Incorrect OAuth Link for client id ${environment.validApp.id}, missing response type parameter.`
    )
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(5))
    cy.hasNoLayout()
    cy.hasZendesk()
  })
  it('show error screen on INVALID redirect URL', function () {
    cy.visit(
      `${environment.baseUrl}/oauth/authorize` +
        oauthUrlBuilder({
          client_id: environment.validApp.id,
          response_type: 'code',
          scope: `/authenticate openid`,
          redirect_uri: 'WRONG',
        })
    )
    cy.get('#error-message').contains(
      `Error: The provided redirect URI WRONG does not match the redirect URIs registered by ${environment.validApp.name} (${environment.validApp.id}).`
    )
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(5))
    cy.hasNoLayout()
    cy.hasZendesk()
  })
  it('show error screen on MISSING redirect URL', function () {
    cy.visit(
      `${environment.baseUrl}/oauth/authorize` +
        oauthUrlBuilder({
          client_id: environment.validApp.id,
          response_type: 'code',
          scope: `/authenticate openid`,
          redirect_uri: undefined,
        })
    )
    cy.get('#error-message').contains(
      `Error: Incorrect OAuth Link for client id ${environment.validApp.id}, missing redirect uri parameter`
    )
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(5))
    cy.hasNoLayout()
    cy.hasZendesk()
  })
  it('show error screen on INVALID scope', function () {
    cy.visit(
      `${environment.baseUrl}/oauth/authorize` +
        oauthUrlBuilder({
          client_id: environment.validApp.id,
          response_type: 'code',
          scope: `/WRONG`,
          redirect_uri: environment.validApp.redirectUrl,
        }),
      {
        onBeforeLoad(win) {
          win.outOfRouterNavigation = () => {}
          cy.stub(win, 'outOfRouterNavigation')
        },
      }
    )
    cy.window()
      .its('outOfRouterNavigation')
      .should(
        'be.calledWith',
        `${environment.validApp.redirectUrl}` + `#error=invalid_scope`
      )
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(2))
    cy.hasNoLayout()
    cy.hasZendesk()
  })
  it('show error screen on UNAUTHORIZED scope', function () {
    cy.visit(
      `${environment.baseUrl}/oauth/authorize` +
        oauthUrlBuilder({
          client_id: environment.validApp.id,
          response_type: 'code',
          scope: `/webhook`,
          redirect_uri: environment.validApp.redirectUrl,
        }),
      {
        onBeforeLoad(win) {
          win.outOfRouterNavigation = () => {}
          cy.stub(win, 'outOfRouterNavigation')
        },
      }
    )
    cy.window()
      .its('outOfRouterNavigation')
      .should(
        'be.calledWith',
        `${environment.validApp.redirectUrl}` + `#error=invalid_scope`
      )
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(2))
    cy.hasNoLayout()
    cy.hasZendesk()
  })
  it('show error screen on MISSING scope', function () {
    cy.visit(
      `${environment.baseUrl}/oauth/authorize` +
        oauthUrlBuilder({
          client_id: environment.validApp.id,
          response_type: 'code',
          scope: undefined,
          redirect_uri: environment.validApp.redirectUrl,
        })
    )
    cy.get('#error-message').contains(
      `Error: Incorrect OAuth Link for client id ${environment.validApp.id}, missing scope parameter.`
    )
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(5))
    cy.hasNoLayout()
    cy.hasZendesk()
  })
})
