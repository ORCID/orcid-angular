/// <reference types="cypress" />
import { environment } from '../cypress.env'
const oauthUrlBuilder = require('../helpers/oauthUrlBuilder')

describe(`Header`, function () {
  it(`has working navigation buttons to the info site`, function () {
    cy.visit(`${environment.baseUrl}`, {
      onBeforeLoad(win) {
        win.outOfRouterNavigation = () => {}
        cy.stub(win, 'outOfRouterNavigation')
      },
    })
    cy.get(`#public-layout\\.about`)
      .click()
      .window()
      .its('outOfRouterNavigation')
      .should('be.calledWith', environment.infoSiteBaseUrl + '/what-is-orcid')

    cy.get(`#public-layout\\.membership`)
      .click()
      .window()
      .its('outOfRouterNavigation')
      .should(
        'be.calledWith',
        environment.infoSiteBaseUrl + '/about-membership'
      )

    cy.get(`#public-layout\\.documentation`)
      .click()
      .window()
      .its('outOfRouterNavigation')
      .should('be.calledWith', environment.infoSiteBaseUrl + '/documentation')

    cy.get(`#public-layout\\.community`)
      .click()
      .window()
      .its('outOfRouterNavigation')
      .should('be.calledWith', environment.infoSiteBaseUrl + '/orcid-community')

    cy.get(`#public-layout\\.newsEvents`)
      .click()
      .window()
      .its('outOfRouterNavigation')
      .should('be.calledWith', environment.infoSiteBaseUrl + '/')

    cy.get(`#public-layout\\.for_researchers`)
      .click()
      .window()
      .its('outOfRouterNavigation')
      .should(
        'be.calledWith',
        environment.infoSiteBaseUrl + '/benefits-for-researchers'
      )
  })
})

describe.only('Homepage', () => {
  it('Has no detectable a11y critical or serious violations', () => {
    cy.visit(`${environment.baseUrl}`)
    cy.injectAxe()
    cy.checkA11y(null, {
      includedImpacts: ['critical'],
    })
  })
})
