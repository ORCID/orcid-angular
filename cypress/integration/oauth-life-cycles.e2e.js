/// <reference types="cypress" />
import { environment } from '../cypress.env'
const randomUser = require('../helpers/randomUser')
const urlMatch = require('../helpers/urlMatch')
const oauthUrlBuilder = require('../helpers/oauthUrlBuilder')

describe('Oauth life cycles', () => {
  before(() => {
    cy.clearCookies()
  })
  describe('Register and authorize', () => {
    before(() => {
      cy.clearCookies()
    })
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
        action: 'New-Registration',
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
        .expectGtagInitialization(`/register${oauthParamsUrl}`)
        .hasNoLayout()
        .hasNoZendesk()
        .expectPreFillRegister(expectedPreFillRegister)
        .registerUser(userToRegister)
        .expectAuthorizeScreen(expectedAuthorizationScreen)
        .expectGtagNavigation(`/oauth/authorize${oauthParamsUrl}`)
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
        action: 'New-Registration',
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
        .expectGtagInitialization(`/signin${oauthParamsUrl}`)
        .hasNoLayout()
        .hasNoZendesk()
        .get('#register-button')
        .click()
        .expectGtagNavigation(`/register${oauthParamsUrl}`)
        .hasNoLayout()
        .hasNoZendesk()
        .expectPreFillRegister(expectedPreFillRegister)
        .registerUser(registeringUser)
        .expectAuthorizeScreen(expectedAuthorizationScreen)
        .expectGtagNavigation(`/oauth/authorize${oauthParamsUrl}`)
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

    it('while login and with `prompt=login` parameter register and authorize', () => {
      const registeringUser = randomUser()
      let oauthParams = {
        client_id: environment.validApp.id,
        response_type: 'code',
        scope: '/authenticate openid',
        redirect_uri: environment.validApp.redirectUrl,
        prompt: 'login',
      }

      let oauthParamsUrl = oauthUrlBuilder(oauthParams)

      let expectedPreFillRegister = {}

      let expectedAuthorizationScreen = {
        displayName: registeringUser.name + ' ' + registeringUser.familyName,
        appName: environment.validApp.name,
        scopes: ['openid'],
      }

      let expectRegrowEvent = {
        action: 'New-Registration',
        memberName: environment.validApp.name,
        clientName: environment.validApp.memberName,
      }

      let expectRedirectUrl = {
        url: environment.validApp.redirectUrl,
        urlParameters: { code: Cypress.sinon.match.string },
      }

      cy.sessionLogin('testUser')
      cy.visit(
        `${environment.baseUrl}/oauth/authorize${oauthParamsUrl}&forceLogin=true`,
        {
          onBeforeLoad: (win) => {
            win.outOfRouterNavigation = () => {}
            cy.stub(win, 'outOfRouterNavigation')
          },
        }
      )
        .expectGtagInitialization(`/signin${oauthParamsUrl}&forceLogin=true`)
        .hasNoLayout()
        .hasNoZendesk()
        .get('#register-button')
        .click()
        .expectGtagNavigation(`/register${oauthParamsUrl}&forceLogin=true`)
        .hasNoLayout()
        .hasNoZendesk()
        .expectPreFillRegister(expectedPreFillRegister)
        .registerUser(registeringUser)
        .expectAuthorizeScreen(expectedAuthorizationScreen)
        .expectGtagNavigation(
          `/oauth/authorize${oauthParamsUrl}&forceLogin=true`
        )
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

    it('use an Oauth request that comes with a redirect URL with client query parameters', () => {
      const registeringUser = randomUser()
      let oauthParams = {
        client_id: environment.validApp.id,
        response_type: 'code',
        scope: '/authenticate openid',
        redirect_uri:
          environment.validApp.redirectUrl +
          '?clientPartyAppState=code&clientPartyAppState2=code2',
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
        displayName: registeringUser.name + ' ' + registeringUser.familyName,
        appName: environment.validApp.name,
        scopes: ['openid'],
      }

      let expectRegrowEvent = {
        action: 'New-Registration',
        memberName: environment.validApp.name,
        clientName: environment.validApp.memberName,
      }

      let expectRedirectUrl = {
        url: environment.validApp.redirectUrl,
        urlParameters: {
          code: Cypress.sinon.match.string,
          clientPartyAppState: 'code',
          clientPartyAppState2: `code2`,
        },
      }

      cy.visit(`${environment.baseUrl}/oauth/authorize${oauthParamsUrl}`, {
        onBeforeLoad: (win) => {
          win.outOfRouterNavigation = () => {}
          cy.stub(win, 'outOfRouterNavigation')
        },
      })
        .expectGtagInitialization(`/register${oauthParamsUrl}`)
        .hasNoLayout()
        .hasNoZendesk()
        .expectPreFillRegister(expectedPreFillRegister)
        .registerUser(registeringUser)
        .expectAuthorizeScreen(expectedAuthorizationScreen)
        .expectGtagNavigation(`/oauth/authorize${oauthParamsUrl}`)
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
    before(() => {
      cy.clearCookies()
    })

    beforeEach(() => {
      // TODO add a programmatic register so adding a testing user doesn't last as much
      const testUser = randomUser()
      cy.wrap(testUser).as('testUser')
      cy.visit(`${environment.baseUrl}/register`).registerUser(testUser)
      cy.clearCookies()
    })

    it('use an Oauth request that comes with an register email', () => {
      cy.get('@testUser').then((testUser) => {
        let oauthParams = {
          client_id: environment.validApp.id,
          response_type: 'code',
          scope: '/authenticate openid',
          redirect_uri: environment.validApp.redirectUrl,
          email: testUser.email,
          family_names: testUser.familyName,
          given_names: testUser.name,
        }

        let expectedPreFilledSignin = {
          username: testUser.email,
        }

        let expectedAuthorizationScreen = {
          displayName: testUser.name + ' ' + testUser.familyName,
          appName: environment.validApp.name,
          scopes: ['openid'],
        }

        let expectRedirectUrl = {
          url: environment.validApp.redirectUrl,
          urlParameters: { code: Cypress.sinon.match.string },
        }

        let oauthParamsUrl = oauthUrlBuilder(oauthParams)

        cy.visit(`${environment.baseUrl}/oauth/authorize${oauthParamsUrl}`, {
          onBeforeLoad: (win) => {
            win.outOfRouterNavigation = () => {}
            cy.stub(win, 'outOfRouterNavigation')
          },
        })
          .expectGtagInitialization(`/signin${oauthParamsUrl}`)
          .expectPreFillSignin(expectedPreFilledSignin)
          .hasNoLayout()
          .hasNoZendesk()
          .signin(testUser)
          .expectAuthorizeScreen(expectedAuthorizationScreen)
          .expectGtagNavigation(`/oauth/authorize${oauthParamsUrl}`)
          .hasNoLayout()
          .hasNoZendesk()
          .get('#authorize-button')
          .click()
          .get('#loading-bar')
          .window()
          .its('outOfRouterNavigation')
          .should('be.calledWith', urlMatch(expectRedirectUrl))
      })
    })

    it('use an Oauth request that comes with no user data', () => {
      cy.get('@testUser').then((testUser) => {
        let oauthParams = {
          client_id: environment.validApp.id,
          response_type: 'code',
          scope: '/authenticate openid',
          redirect_uri: environment.validApp.redirectUrl,
        }

        let expectedPreFilledSignin = {}

        let expectedAuthorizationScreen = {
          displayName: testUser.name + ' ' + testUser.familyName,
          appName: environment.validApp.name,
          scopes: ['openid'],
        }

        let expectRedirectUrl = {
          url: environment.validApp.redirectUrl,
          urlParameters: { code: Cypress.sinon.match.string },
        }

        let oauthParamsUrl = oauthUrlBuilder(oauthParams)

        cy.visit(`${environment.baseUrl}/oauth/authorize${oauthParamsUrl}`, {
          onBeforeLoad: (win) => {
            win.outOfRouterNavigation = () => {}
            cy.stub(win, 'outOfRouterNavigation')
          },
        })
          .expectGtagInitialization(`/signin${oauthParamsUrl}`)
          .expectPreFillSignin(expectedPreFilledSignin)
          .hasNoLayout()
          .hasNoZendesk()
          .signin(testUser)
          .expectAuthorizeScreen(expectedAuthorizationScreen)
          .expectGtagNavigation(`/oauth/authorize${oauthParamsUrl}`)
          .hasNoLayout()
          .hasNoZendesk()
          .get('#authorize-button')
          .click()
          .get('#loading-bar')
          .window()
          .its('outOfRouterNavigation')
          .should('be.calledWith', urlMatch(expectRedirectUrl))
      })
    })
  })
  describe('Forgot password and authorize', () => {
    before(() => {
      cy.clearCookies()
    })
    beforeEach(() => {
      // TODO add a programmatic register so adding a testing user doesn't last as much
      const testUser = randomUser()
      cy.wrap(testUser).as('testUser')
      cy.visit(`${environment.baseUrl}/register`).registerUser(testUser)
      cy.clearCookies()
    })
    it('Goes into forgot password and comes back to finish a regular signin authorize', () => {
      cy.get('@testUser').then((testUser) => {
        let oauthParams = {
          client_id: environment.validApp.id,
          response_type: 'code',
          scope: '/authenticate openid',
          redirect_uri: environment.validApp.redirectUrl,
        }

        let expectedPreFilledSignin = {}

        let expectedAuthorizationScreen = {
          displayName: testUser.name + ' ' + testUser.familyName,
          appName: environment.validApp.name,
          scopes: ['openid'],
        }

        let expectRedirectUrl = {
          url: environment.validApp.redirectUrl,
          urlParameters: { code: Cypress.sinon.match.string },
        }

        let oauthParamsUrl = oauthUrlBuilder(oauthParams)

        cy.visit(`${environment.baseUrl}/oauth/authorize${oauthParamsUrl}`, {
          onBeforeLoad: (win) => {
            win.outOfRouterNavigation = () => {}
            cy.stub(win, 'outOfRouterNavigation')
          },
        })
          .expectGtagInitialization(`/signin${oauthParamsUrl}`)
          .expectPreFillSignin(expectedPreFilledSignin)
          .hasNoLayout()
          .hasNoZendesk()
          .get('#forgot-password-button')
          .click()

          .expectGtagNavigation(`/reset-password${oauthParamsUrl}`)
          .hasNoLayout()
          .hasNoZendesk()
          .go('back')

          .expectGtagNavigation(`/signin${oauthParamsUrl}`)
          .expectPreFillSignin(expectedPreFilledSignin)
          .hasNoLayout()
          .hasNoZendesk()
          .signin(testUser)

          .expectGtagNavigation(`/oauth/authorize${oauthParamsUrl}`)
          .expectAuthorizeScreen(expectedAuthorizationScreen)
          .hasNoLayout()
          .hasNoZendesk()
          .get('#authorize-button')
          .click()
          .get('#loading-bar')

          .window()
          .its('outOfRouterNavigation')
          .should('be.calledWith', urlMatch(expectRedirectUrl))
      })
    })
  })
  describe('Social sign-in and authorize', () => {
    //TODO links account and authorize
  })
  describe('Institutional sign-in and authorize', () => {
    before(() => {
      cy.clearCookies()
    })
    beforeEach(() => {
      // TODO add a programmatic register so adding a testing user doesn't last as much
      const testUser = randomUser()
      cy.wrap(testUser).as('testUser')
      cy.visit(`${environment.baseUrl}/register`).registerUser(testUser)
      cy.clearCookies()
    })
    it('Goes into institutional signin and comes back to finish a regular signin authorize', () => {
      cy.get('@testUser').then((testUser) => {
        let oauthParams = {
          client_id: environment.validApp.id,
          response_type: 'code',
          scope: '/authenticate openid',
          redirect_uri: environment.validApp.redirectUrl,
        }

        let expectedPreFilledSignin = {}

        let expectedAuthorizationScreen = {
          displayName: testUser.name + ' ' + testUser.familyName,
          appName: environment.validApp.name,
          scopes: ['openid'],
        }

        let expectRedirectUrl = {
          url: environment.validApp.redirectUrl,
          urlParameters: { code: Cypress.sinon.match.string },
        }

        let oauthParamsUrl = oauthUrlBuilder(oauthParams)

        cy.visit(`${environment.baseUrl}/oauth/authorize${oauthParamsUrl}`, {
          onBeforeLoad: (win) => {
            win.outOfRouterNavigation = () => {}
            cy.stub(win, 'outOfRouterNavigation')
          },
        })
          .expectGtagInitialization(`/signin${oauthParamsUrl}`)
          .expectPreFillSignin(expectedPreFilledSignin)
          .hasNoLayout()
          .hasNoZendesk()
          .get('#access-through-your-institution-button')
          .click()

          .expectGtagNavigation(`/institutional-signin${oauthParamsUrl}`)
          .hasNoLayout()
          .hasNoZendesk()
          .get('#go-back-button')
          .click()

          .expectGtagNavigation(`/signin${oauthParamsUrl}`)
          .expectPreFillSignin(expectedPreFilledSignin)
          .hasNoLayout()
          .hasNoZendesk()
          .signin(testUser)

          .expectGtagNavigation(`/oauth/authorize${oauthParamsUrl}`)
          .expectAuthorizeScreen(expectedAuthorizationScreen)
          .hasNoLayout()
          .hasNoZendesk()
          .get('#authorize-button')
          .click()
          .get('#loading-bar')

          .window()
          .its('outOfRouterNavigation')
          .should('be.calledWith', urlMatch(expectRedirectUrl))
      })
    })
  })
  describe('Open a Oauth url and then forget about it', () => {
    before(() => {
      cy.clearCookies()
    })
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
    before(() => {
      cy.clearCookies()
    })
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
