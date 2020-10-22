/// <reference types="cypress" />

describe('Google Analytics', function () {
  beforeEach(function () {})

  it('Landing on the homepage and then navigate to the signin page', function () {
    cy.visit('https://dev.orcid.org')
    cy.checkGtagInitialization('/')
    cy.get('#menu-signing-button').click()
    cy.checkGtagNavigation('/signin')
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(6))
  })

  it('Landing on sign in page and goes to the homepage', function () {
    cy.visit('https://dev.orcid.org/signin')
    cy.checkGtagInitialization('/signin')
    cy.get('#home-logo').click()
    cy.checkGtagNavigation('/')
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(6))
  })

  it('Lands on home page and navigate to the register', function () {
    cy.visit('https://dev.orcid.org')
    cy.checkGtagInitialization('/')
    cy.get('#menu-signing-button').click()
    cy.checkGtagNavigation('/signin')
    cy.get('#register-button').click()
    cy.checkGtagNavigation('/register')
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(8))
  })

  it('Lands on the Oauth page goes to the register page and finish a registration', function () {
    cy.visit(
      'https://dev.orcid.org/oauth/authorize?client_id=APP-MLXS7JVFJS9FEIFJ&response_type=code&scope=/authenticate openid&redirect_uri=https://developers.google.com/oauthplayground'
    )

    const afterRedirectParameters =
      'client_id=APP-MLXS7JVFJS9FEIFJ&response_type=code&scope=openid%20%2Fauthenticate&redirect_uri=https:%2F%2Fdevelopers.google.com%2Foauthplayground&oauth=&forceLogin=false'

    cy.checkGtagInitialization('/signin?' + afterRedirectParameters)
    cy.get('#register-button').click()
    cy.checkGtagNavigation('/register?' + afterRedirectParameters)
    cy.get('@ga').then((value) => expect(value.callCount).to.be.eq(6))
  })

  // TODO @leomendoza123 test register and Oauth events
})
