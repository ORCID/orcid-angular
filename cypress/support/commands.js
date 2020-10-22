// A mach that filters out all the non-api calls that gtag does to the datalayer array
var isNotAnInternalGtagCall = Cypress.sinon.match(function (value) {
  return !!value & !!value[0] && value[1] !== 'optimize.callback'
}, 'isNotAnInternalGtagCall')

let gtagApiCallsCount = 0
Cypress.on('window:before:load', (win) => {
  // Stub datalayer push function
  win.dataLayer = win.dataLayer || []
  cy.stub(win.dataLayer, 'push')
    .withArgs(isNotAnInternalGtagCall)
    .callsFake((args) => {
      console.log(args)
    })
    .as('ga')
})

Cypress.Commands.add('checkGtagInitialization', (url) => {
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
          sample_rate: 70,
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
          page_location: url,
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
          page_path: url,
          page_location: Cypress.sinon.match(
            'orcid.org' + url === '/' ? '' : url
          ),
          sample_rate: Cypress.sinon.match.string,
        }),
      })
    )
})

Cypress.Commands.add('checkGtagNavigation', (url) => {
  cy.get('@ga')
    // Measure loading time
    .should(
      'be.calledWith',
      Cypress.sinon.match({
        0: 'event',
        1: 'timing_complete',
        2: Cypress.sinon.match({
          page_location: url,
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
          page_location: Cypress.sinon.match(url),
          page_path: url,
        }),
      })
    )
})
