Cypress.Commands.add('expectPreFillRegister', (user) => {
  return cy
    .get('#given-names-input')
    .then((x) => {
      if (user.givenNames) {
        expect(x).have.value(user.givenNames)
      } else {
        expect(x).to.be.empty
      }
    })
    .get('#family-names-input')
    .then((x) => {
      if (user.familyNames) {
        expect(x).have.value(user.familyNames)
      } else {
        expect(x).to.be.empty
      }
    })
    .get('#email-input')
    .then((x) => {
      if (user.email) {
        expect(x).have.value(user.email)
      } else {
        expect(x).to.be.empty
      }
    })
})

Cypress.Commands.add('registerUser', (user) => {
  return cy
    .location()
    .should((loc) => {
      expect(loc.pathname).to.eq('/register')
    })
    .get('#given-names-input')
    .clear()
    .type(user.name)
    .should('have.value', user.name)
    .get('#family-names-input')
    .clear()
    .type(user.familyName)
    .should('have.value', user.familyName)
    .get('#email-input')
    .clear()
    .type(user.email)
    .should('have.value', user.email)
    .get('#confirm-email-input')
    .clear()
    .type(user.email)
    .should('have.value', user.email)
    .get('#step-a-next-button')
    .click()
    .get('#password-input')
    .clear()
    .type(user.password)
    .should('have.value', user.password)
    .get('#password-confirm-input')
    .clear()
    .type(user.password)
    .should('have.value', user.password)
    .get('#step-b-next')
    .click()
    .get('#visibility-everyone-input')
    .click()
    .should('have.class', 'mat-radio-checked')
    .get('#privacy-input input')
    .check({ force: true })
    .should('be.checked')
    .acceptCaptcha()
    .get('#step-c-register-button')
    .click()
    .get('#loading-bar')
    .get('#bottom-loading-bar')
    .get('app-register', { timeout: 100000 })
    .should('not.exist')
    .location()
    .should((loc) => {
      expect(loc.pathname).to.not.eq('/register')
    })
})

Cypress.Commands.add('acceptCaptcha', () => {
  return cy.getIframeBody('iframe').within(
    () =>
      cy
        .get('.recaptcha-checkbox-border')
        .click()
        .get('#recaptcha-anchor', { timeout: 10000 })
        .should('have.class', 'recaptcha-checkbox-checked')
  )
})

Cypress.Commands.add('getIframeBody', (target) => {
  return cy
    .get(target)
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap)
})
