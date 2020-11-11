/// <reference types="cypress" />
import { env } from 'process'
import { environment } from '../cypress.env'
const oauthUrlBuilder = require('../helpers/oauthUrlBuilder')

describe(`Google Analytics`, function () {
  before(() => {
    cy.clearCookies()
  })
  beforeEach(function () {})

  it(`Landing on the homepage and then navigate to the signin page`, function () {
    cy.visit(`${environment.baseUrl}`)
    cy.expectGtagInitialization(`/`)
    cy.get(`#menu-signin-button `).click()
    cy.expectGtagNavigation(`/signin`)
    cy.get(`@ga`).then((value) => expect(value.callCount).to.be.eq(6))
  })

  it(`Landing on sign in page and goes to the homepage`, function () {
    cy.visit(`${environment.baseUrl}/signin`)
    cy.expectGtagInitialization(`/signin`)
    cy.get(`#home-logo`).click()
    cy.expectGtagNavigation(`/`)
    cy.get(`@ga`).then((value) => expect(value.callCount).to.be.eq(6))
  })

  it(`Lands on home page and navigate to the register`, function () {
    cy.visit(`${environment.baseUrl}`)
    cy.expectGtagInitialization(`/`)
    cy.get(`#menu-signin-button `).click()
    cy.expectGtagNavigation(`/signin`)
    cy.get(`#register-button`).click()
    cy.expectGtagNavigation(`/register`)
    cy.get(`@ga`).then((value) => expect(value.callCount).to.be.eq(8))
  })

  it(`Lands on the Oauth page goes to the register page`, function () {
    const oauthParams = oauthUrlBuilder({
      client_id: environment.validApp.id,
      response_type: 'code',
      scope: `/authenticate openid`,
      redirect_uri: environment.validApp.redirectUrl,
    })

    cy.visit(`${environment.baseUrl}/oauth/authorize${oauthParams}`)
    cy.expectGtagInitialization(`/signin` + oauthParams)
    cy.get(`#register-button`).click()
    cy.expectGtagNavigation(`/register` + oauthParams)
    cy.get(`@ga`).then((value) => expect(value.callCount).to.be.eq(6))
  })

  // TODO @leomendoza123 test register and Oauth events
})
