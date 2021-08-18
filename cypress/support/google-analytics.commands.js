import { environment } from '../cypress.env'
import urlMatch from '../helpers/urlMatch'

// A mach that filters out all the non-api calls that gtag does to the datalayer array
var isNotAnInternalGtagCall = Cypress.sinon.match(function (value) {
  return !!value & !!value[0] && value[1] !== 'optimize.callback'
}, 'isNotAnInternalGtagCall')

Cypress.on('window:before:load', (win) => {
  // Stub datalayer push function
  win.dataLayer = win.dataLayer || []
  cy.stub(win.dataLayer, 'push')
    .withArgs(isNotAnInternalGtagCall)
    .callsFake((args) => {
      console.debug(args)
    })
    .as('ga')
})

Cypress.Commands.add('expectGtagInitialization', (url) => {
  cy.get('@ga')
    // First two calls done from index.html Gtag script initialization
    // with send_page_view disable as describe on https://developers.google.com/analytics/devguides/collection/gtagjs
    .should('be.calledWith', { 0: 'js', 1: Cypress.sinon.match.date })
    .and(
      'be.calledWith',
      Cypress.sinon.match({
        0: 'config',
        1: Cypress.sinon.match('UA-'),
        2: {
          anonymize_ip: true,
          cookie_flags: 'SameSite=None;Secure',
          sample_rate: 100,
          send_page_view: false,
        },
      })
    )
    // Measure loading time
    .and(
      'be.calledWith',
      Cypress.sinon.match({
        0: 'event',
        1: 'timing_complete',
        2: Cypress.sinon.match({
          page_location: urlMatch(url),
        }),
      })
    )
    // Register page view as describe on https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications#measure_virtual_pageviews
    .and(
      'be.calledWith',
      Cypress.sinon.match({
        0: 'config',
        1: Cypress.sinon.match('UA-'),
        2: Cypress.sinon.match({
          page_path: urlMatch(url),
          page_location: urlMatch(environment.baseUrl + url),
          sample_rate: Cypress.sinon.match.string,
        }),
      })
    )
})

Cypress.Commands.add('expectGtagNavigation', (url) => {
  return (
    cy
      .get('@ga')
      // Measure loading time
      .should(
        'be.calledWith',
        Cypress.sinon.match({
          0: 'event',
          1: 'timing_complete',
          2: Cypress.sinon.match({
            page_location: urlMatch(url),
          }),
        })
      )
      // Register page view as describe on https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications#measure_virtual_pageviews
      .and(
        'be.calledWith',
        Cypress.sinon.match({
          0: 'config',
          1: Cypress.sinon.match('UA-'),
          2: Cypress.sinon.match({
            page_location: urlMatch(environment.baseUrl + url),
            page_path: urlMatch(url),
          }),
        })
      )
  )
})

Cypress.Commands.add('expectGtagRegrow', (event) => {
  return (
    cy
      .get('@ga')
      // Measure loading time
      .should(
        'be.calledWith',
        Cypress.sinon.match({
          0: 'event',
          1: event.action,
          2: Cypress.sinon.match({
            event_category: 'RegGrowth',
            event_label: `OAuth ${event.clientName} - ${event.memberName}`,
          }),
        })
      )
  )
})
