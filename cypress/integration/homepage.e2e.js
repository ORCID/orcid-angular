/// <reference types="cypress" />
import { environment } from '../cypress.env'
const oauthUrlBuilder = require('../helpers/oauthUrlBuilder')
const runInfo = require('../helpers/runInfo')

describe('Homepage' + runInfo(), () => {
  it('Has no detectable a11y critical violations', () => {
    cy.visit(`${environment.baseUrl}`)
      .injectAxe()
      .checkA11y(null, {
        includedImpacts: ['critical'],
      })
  })

  if (environment.newInfoSiteEnable) {
    it(`has a header with working navigation buttons to the info site`, function () {
      cy.visit(`${environment.baseUrl}`, {
        onBeforeLoad(win) {
          win.outOfRouterNavigation = () => {}
          cy.stub(win, 'outOfRouterNavigation')
        },
      })
        .get(`.button-wrapper:nth-child(1)`)
        .click()
        .window()
        .its('outOfRouterNavigation')
        .should('be.calledWith', environment.infoSiteBaseUrl + '/what-is-orcid')

        .get(`.button-wrapper:nth-child(2)`)
        .click()
        .window()
        .its('outOfRouterNavigation')
        .should(
          'be.calledWith',
          environment.infoSiteBaseUrl + '/benefits-for-researchers'
        )

        .get(`.button-wrapper:nth-child(3)`)
        .click()
        .window()
        .its('outOfRouterNavigation')
        .should(
          'be.calledWith',
          environment.infoSiteBaseUrl + '/about-membership'
        )

        .get(`.button-wrapper:nth-child(4)`)
        .click()
        .window()
        .its('outOfRouterNavigation')
        .should('be.calledWith', environment.infoSiteBaseUrl + '/documentation')

        .get(`.button-wrapper:nth-child(5)`)
        .click()
        .window()
        .its('outOfRouterNavigation')
        .should(
          'be.calledWith',
          environment.infoSiteBaseUrl + '/resources'
        )

        .get(`.button-wrapper:nth-child(6)`)
        .click()
        .window()
        .its('outOfRouterNavigation')
        .should('be.calledWith', environment.infoSiteBaseUrl + '/')
    })
  }
})
