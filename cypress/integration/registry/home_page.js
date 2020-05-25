const name = '22mar2020'

context('Registration', () => {
  /* it('Access https://qa.orcid.org/ and locate the cookies banner', () => {
    cy.visit('qa.orcid.org')
    cy.get('app-banner').contains('ORCID uses cookies to improve your experience and to help us understand how you use our websites. Learn more about how we use cookies.')
  })*/

  it('Registration step 1', () => {
    cy.visit('qa.orcid.org/register')
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
    cy.get('input:visible')
      .last()
      .type('00_ma_test_' + name + '@mailinator.com')
      .should('have.value', '00_ma_test_' + name + '@mailinator.com')
    cy.get('a[role="button"]').contains('addAdd another email').click()
    cy.get('input:visible')
      .last()
      .type('01_ma_test_' + name + '@mailinator.com')
      .should('have.value', '01_ma_test_' + name + '@mailinator.com')
    cy.wait(1000)
    cy.get('button:visible')
      .filter("[type='submit']")
      .click()
      .click(10, 10, { force: true })
      .click(10, 10, { force: true })
      .click(10, 10, { force: true })
      .click(10, 10, { force: true })
      .click(10, 10, { force: true })
      .click(10, 10, { force: true })
      .click(10, 10, { force: true })
  })

  it('Registration step 2', () => {
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
    cy.wait(1000)
    cy.get('button:visible').filter('[type="submit"]').click()
  })

  it('Registration step 3', () => {
    cy.get('mat-radio-group[formcontrolname="activitiesVisibilityDefault"]')
      .contains('Everyone')
      .click()
      .parent()
      .should('have.class', 'mat-radio-checked')
    cy.get('input:visible')
      .filter('[type="checkbox"]')
      .check({ force: true })
      .should('be.checked')
    cy.wait(2000)
    cy.get('iframe')
  })
})

context('Sign in and send verification messages', () => {
  it('Access https://qa.orcid.org/, locate and click the "SIGN IN / REGISTER" button', () => {
    cy.visit('/')
    cy.get('button[aria-label="sign in or register"]').click()
  })

  it('Enter credentials and click sign in', () => {
    cy.get('input[formcontrolname="username"]')
      .type('unverified@mailinator.com')
      .should('have.value', 'unverified@mailinator.com')
    cy.get('input[formcontrolname="password"]')
      .type('test1234')
      .should('have.value', 'test1234')
      .and('have.attr', 'type', 'password')
    cy.get('button[type="submit"]').click()
  })

  it('Resend verification message twice', () => {
    cy.contains('Resend verification email').click()
    cy.wait(1000)
    cy.get('button').filter('.btn-white-no-border').contains('Close').click()
    cy.get('.edit-biography').click({ force: true })
    cy.contains('Resend verification email').click()
    cy.wait(1000)
    cy.get('button').filter('.btn-white-no-border').contains('Close').click()
  })
})
