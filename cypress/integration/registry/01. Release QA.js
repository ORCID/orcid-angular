/*
const date = require('../../helpers/date')
let name

describe.skip('"Manual" QA Tests', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID')
  })

  context('Check the cookies banner', () => {
    it('Clear cookies', () => {
      cy.clearCookies()
    })

    it('Visit https://qa.orcid.org/ and find the cookies banner', () => {
      cy.visit('qa.orcid.org')
      cy.get('app-banner').contains(
        'ORCID uses cookies to improve your experience and to help us understand how you use our websites. Learn more about how we use cookies.'
      )
      cy.getIframeBody('#launcher').find('span').contains('Help').click()
    })
  })

  context('Registration', () => {
    it('Access the registration page', () => {
      cy.get('button[aria-label="sign in or register"]').click()
      cy.get('app-sign-in').contains('Register now').click({ force: true })
    })

    it('Generate name, write it down into a file for later use', () => {
      name = date()
      cy.writeFile('./cypress/integration/registry/data/name.txt', date())
    })

    it('Registration step 1', () => {
      // Bypass the duplicated research call to avoid getting the "Is this you modal"
      cy.server()
      cy.route({
        method: 'GET',
        url: '/dupicateResearcher.json*',
        response: {},
      })

      // Only get items inside app-step-a
      cy.get('app-step-a').within(() => {
        cy.get('input[formcontrolname="givenNames"]')
          .type('ma_test')
          .should('have.value', 'ma_test')
        cy.get('input[formcontrolname="familyNames"]')
          .type(name)
          .should('have.value', name)
        cy.get('input[formcontrolname="email"]')
          .type('ma_test_' + name + '@mailinator.com')
          .should('have.value', 'ma_test_' + name + '@mailinator.com')
        cy.get('input[formcontrolname="confirmEmail"]')
          .type('ma_test_' + name + '@mailinator.com')
          .should('have.value', 'ma_test_' + name + '@mailinator.com')
        cy.get('input')
          .last()
          .type('00_ma_test_' + name + '@mailinator.com')
          .should('have.value', '00_ma_test_' + name + '@mailinator.com')
        cy.get('a[role="button"]').contains('addAdd another email').click()
        cy.get('input')
          .last()
          .type('01_ma_test_' + name + '@mailinator.com')
          .should('have.value', '01_ma_test_' + name + '@mailinator.com')
        cy.get('button')
          // Wait until the step is marked as validated
          .filter('.ng-valid [type="submit"]')
          .click()
      })
    })

    it('Registration step 2', () => {
      cy.get('app-step-b').within(() => {
        cy.get('.mat-card-header-text:visible').should(
          'have.text',
          'Create your ORCID iDThis is step 2 of 3'
        )
        cy.get('input[formcontrolname="password"]')
          .type('test1234')
          .should('have.value', 'test1234')
          .and('have.attr', 'type', 'password')
        cy.get('input[formcontrolname="passwordConfirm"]')
          .type('test1234')
          .should('have.value', 'test1234')
          .and('have.attr', 'type', 'password')
        cy.get('input:visible')
          .filter('[type="checkbox"]')
          .check({ force: true })
          .should('be.checked')
        cy.get('button:visible')
          .filter('app-step-b.ng-valid [type="submit"]')
          .click()
      })
    })

    it('Registration step 3', () => {
      cy.get('app-step-c').within(() => {
        cy.get('mat-radio-group[formcontrolname="activitiesVisibilityDefault"]')
          .contains('Everyone')
          .click()
          .parent()
          .should('have.class', 'mat-radio-checked')
        cy.get('input:visible')
          .filter('[type="checkbox"]')
          .check({ force: true })
          .should('be.checked')
        // Wrap iframe body into a cypress object and perform test within there
        cy.getIframeBody('iframe').within(() => {
          cy.get('.recaptcha-checkbox-border').click()
          cy.get('#recaptcha-anchor', { timeout: 10000 }).should(
            'have.class',
            'recaptcha-checkbox-checked'
          )
        })
        cy.get('button:visible').contains('REGISTER').click()
      })
    })
  })

  context('Verification 1: Request Verification Messages', () => {
    it('Send 2nd verification message', () => {
      cy.contains('Resend verification email', { timeout: 20000 }).click()
      cy.wait(1000)
      cy.get('button').filter('.btn-white-no-border').contains('Close').click()
    })

    it('Attempt to edit biography and send 3rd verification message', () => {
      cy.get('.edit-biography', { timeout: 20000 }).click({ force: true })
      cy.get('#colorbox #modal-close')
        .contains('Resend verification email')
        .click()
      cy.get('button').filter('.btn-white-no-border').contains('Close').click()
    })

    it('Sign out', () => {
      cy.get('user-menu').click()
      cy.get('a:visible')
        .filter('[href="https://qa.orcid.org/signout"]')
        .click()
    })
  })

  // Domain switch to mailinator.com

  context('Verification 2: Mailinator Tests', () => {
    it('Visit Mailinator', () => {
      cy.visit('https://mailinator.com')
    })

    it('Retrieve ORCID name', () => {
      cy.readFile('./cypress/integration/registry/data/name.txt').then(
        (content) => {
          name = content
        }
      )
    })

    it('Sign into Mailinator', () => {
      cy.visit('https://mailinator.com')
      cy.get('#addOverlay')
        .type('ma_test_' + name)
        .should('have.value', 'ma_test_' + name)
      cy.get('#go-to-public').click()
    })

    it('Verify there are three emails present', () => {
      cy.get('tbody:visible', { timeout: 120000 })
        .find('tr')
        .should('have.length', 3)
    })

    it('Click the first message', () => {
      cy.get('tbody').children().first().click(100, 15)
    })
    it('Fetch the verification link', () => {
      cy.getIframeBody('iframe')
        .find('a')
        .contains('Verify your email address')
        .should('have.attr', 'href')
        .then((href) => {
          cy.writeFile('./cypress/integration/registry/data/link.txt', href)
        })
    })
  })

  context('Verification 3: Wrapping Up', () => {
    it('Visit verification link', () => {
      cy.readFile('./cypress/integration/registry/data/link.txt').then(
        (href) => {
          cy.visit(href)
        }
      )
    })

    it('Retrieve ORCID name', () => {
      cy.readFile('./cypress/integration/registry/data/name.txt').then(
        (content) => {
          name = content
        }
      )
    })

    it('Sign in', () => {
      cy.get('input[formcontrolname="username"]')
        .type('ma_test_' + name + '@mailinator.com')
        .should('have.value', 'ma_test_' + name + '@mailinator.com')
      cy.get('input[formcontrolname="password"]')
        .type('test1234')
        .should('have.value', 'test1234')
        .and('have.attr', 'type', 'password')
      cy.get('button[type="submit"]').click()
    })

    it('Save ORCID iD into a file', () => {
      cy.get('#orcid-id')
        .invoke('text')
        .then((orcid) => {
          cy.writeFile('./cypress/integration/registry/data/orcid.txt', orcid)
        })
    })

    it('Sign out', () => {
      cy.get('user-menu').click()
      cy.get('a:visible')
        .filter('[href="https://qa.orcid.org/signout"]')
        .click()
    })
  })

  context('Password reset procedure 1: Request Link', () => {
    it('Find and click the "Forgot your password or ORCID ID?" button', () => {
      cy.get('a:visible').contains('Forgot your password or ORCID ID?').click()
      cy.wait(1000)
    })
    it('Request password reset link', () => {
      cy.get('input:visible')
        .filter('[formcontrolname="email"]')
        .type('ma_test_' + name + '@mailinator.com')
        .should('have.value', 'ma_test_' + name + '@mailinator.com')
      cy.get('button:visible').filter('[type="submit"]').click()
    })
    it('Reload', () => {
      cy.reload()
    })
    it('Request ORCID iD', () => {
      cy.get('mat-chip:visible').filter('[value="remindOrcidId"]').click()
      cy.get('input:visible')
        .filter('[formcontrolname="email"]')
        .type('ma_test_' + name + '@mailinator.com')
        .should('have.value', 'ma_test_' + name + '@mailinator.com')
      cy.get('button:visible').filter('[type="submit"]').click()
    })
  })

  context('Password reset procedure 2: Mailinator', () => {
    it('Visit Mailinator', () => {
      cy.visit('https://mailinator.com')
    })

    it('Retrieve ORCID name', () => {
      cy.readFile('./cypress/integration/registry/data/name.txt').then(
        (content) => {
          name = content
        }
      )
    })

    it('Sign into Mailinator', () => {
      cy.get('#addOverlay')
        .type('ma_test_' + name)
        .should('have.value', 'ma_test_' + name)
      cy.get('#go-to-public').click()
    })

    it('Check that the "About your ORCID iD" message is present', () => {
      cy.get('tbody:visible')
        .find('tr', { timeout: 120000 })
        .should('have.length', 5)
        .contains('Your ORCID iD')
    })

    it('Open the reset password message', () => {
      cy.get('tbody')
        .children()
        .contains('About your password reset request')
        .click(100, 15)
    })
    it('Fetch the password reset link', () => {
      cy.getIframeBody('iframe')
        .find('a')
        .contains('qa.orcid.org/reset-password-email')
        .should('have.attr', 'href')
        .then((href) => {
          cy.writeFile('./cypress/integration/registry/data/link.txt', href)
        })
    })
  })

  context('Password reset procedure 3: ', () => {
    it('Retrieve ORCID name', () => {
      cy.readFile('./cypress/integration/registry/data/link.txt').then(
        (href) => {
          cy.visit(href)
        }
      )
    })

    it('Retrieve ORCID name', () => {
      cy.readFile('./cypress/integration/registry/data/name.txt').then(
        (content) => {
          name = content
        }
      )
    })

    it('Reset password', () => {
      cy.get('#passwordField').type(name)
      cy.get('#retypedPassword').type(name)
      cy.get('button:visible').contains('Save changes').click()
    })

    it('Sign in using new credentials', () => {
      cy.get('input[formcontrolname="username"]')
        .type('ma_test_' + name + '@mailinator.com')
        .should('have.value', 'ma_test_' + name + '@mailinator.com')
      cy.get('input[formcontrolname="password"]')
        .type(name)
        .should('have.value', name)
        .and('have.attr', 'type', 'password')
      cy.get('button[type="submit"]').click()
    })

    it('Sign out', () => {
      cy.get('user-menu').click()
      cy.get('a:visible')
        .filter('[href="https://qa.orcid.org/signout"]')
        .click()
    })
  })
})
*/
