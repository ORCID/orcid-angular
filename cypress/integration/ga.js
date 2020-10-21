// in our cypress.json file we have blocked the www.google-analytics.com host
// which prevents the GA script from ever loading. however because there
// is still a global 'window.ga' function, that means we can stub it
// and ensure its called correctly.
//
// if you pop open your dev tools you will see that the network request
// for the script tag returns 503 because it's been blocked.

// using a global event handler here because likely
// in your real app you'll always want to stub window.ga
//
// if not you could just add a onBeforeLoad() callback
// to the cy.visit

/// <reference types="cypress" />

Cypress.on('window:before:load', (win) => {
  // because this is called before any scripts
  // have loaded - the ga function is undefined
  // so we need to create it.
  win.dataLayer = win.dataLayer || []
  cy.stub(win.dataLayer, 'push')
    .callsFake((args) => {
      console.log(args)
    })
    .as('ga')
})

describe('Google Analytics', function () {
  beforeEach(function () {
    cy.visit('dev.orcid.org')
  })

  it('Initialize GA correctly when lands on the homepage', function () {
    cy.get('@ga')
      .should('be.calledWith', { 0: 'js', 1: Cypress.sinon.match.date })
      .and(
        'be.calledWith',
        Cypress.sinon.match({
          0: 'config',
          1: 'UA-0000000-00',
          2: {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
            sample_rate: 0,
            send_page_view: false,
          },
        })
      )
      .and('be.calledWith', Cypress.sinon.match({ event: 'gtm.dom' }))
      .and(
        'be.calledWith',
        Cypress.sinon.match({ 0: 'event', 1: 'timing_complete' })
      )
      .and(
        'be.calledWith',
        Cypress.sinon.match({
          0: 'config',
          1: 'UA-0000000-00',
          2: Cypress.sinon.match({
            page_path: '/',
          }),
        })
      )
    cy.get('@ga').should('have.callCount', 6)
  })


})
