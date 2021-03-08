Cypress.Commands.add('cleanBiography', () => {
  cy.getCookie('XSRF-TOKEN').then((cookie) => {
    cy.request({
      method: 'POST',
      url: '/account/biographyForm.json', // baseUrl is prepended to url
      body: {
        errors: [],
        biography: {
          errors: [],
          getRequiredMessage: null,
          required: true,
          value: '',
        },
        visibility: {
          errors: [],
          required: true,
          getRequiredMessage: null,
          visibility: 'LIMITED',
        },
      },
      headers: {
        'X-XSRF-TOKEN': cookie.value,
      },
    })
  })
})

Cypress.Commands.add('cleanCountries', () => {
  cy.getCookie('XSRF-TOKEN').then((cookie) => {
    cy.request({
      method: 'POST',
      url: '/account/countryForm.json', // baseUrl is prepended to url
      body: {
        errors: [],
        addresses: [],
        visibility: {
          errors: [],
          required: true,
          getRequiredMessage: null,
          visibility: 'LIMITED',
        },
      },
      headers: {
        'X-XSRF-TOKEN': cookie.value,
      },
    })
  })
})

Cypress.Commands.add('cleanBiography', () => {
  cy.getCookie('XSRF-TOKEN').then((cookie) => {
    cy.request({
      method: 'POST',
      url: '/account/nameForm.json', // baseUrl is prepended to url
      body: {
        errors: [],
        givenNames: {
          errors: [],
          getRequiredMessage: null,
          required: true,
          value: '',
        },
        familyName: {
          errors: [],
          getRequiredMessage: null,
          required: true,
          value: '',
        },
        creditName: {
          errors: [],
          getRequiredMessage: null,
          required: true,
          value: '',
        },
        visibility: {
          errors: [],
          required: true,
          getRequiredMessage: null,
          visibility: 'LIMITED',
        },
      },
      headers: {
        'X-XSRF-TOKEN': cookie.value,
      },
    })
  })
})

/**
 * Clean all emails except the primary email
 * @returns {any}
 */
Cypress.Commands.add('cleanEmails', () => {
  cy.getCookie('XSRF-TOKEN').then((cookie) => {
    cy.request({
      method: 'POST',
      url: '/account/emails.json', // baseUrl is prepended to url
      body: {
        emails: [],
        errors: [],
      },
      headers: {
        'X-XSRF-TOKEN': cookie.value,
      },
    })
  })
})

/**
 * Clean all keywords
 * @returns {any}
 */
Cypress.Commands.add('cleanKeywords', () => {
  cy.getCookie('XSRF-TOKEN').then((cookie) => {
    cy.request({
      method: 'POST',
      url: '/my-orcid/keywordsForms.json', // baseUrl is prepended to url
      body: {
        errors: [],
        keywords: [],
        visibility: {
          errors: [],
          required: true,
          getRequiredMessage: null,
          visibility: 'LIMITED',
        },
      },
      headers: {
        'X-XSRF-TOKEN': cookie.value,
      },
    })
  })
})

Cypress.Commands.add('cleanPersonalIdentifiers', () => {
  cy.getCookie('XSRF-TOKEN').then((cookie) => {
    cy.request({
      method: 'POST',
      url: '/account/emails.json', // baseUrl is prepended to url
      body: {
        errors: [],
        externalIdentifiers: [],
        },
      headers: {
        'X-XSRF-TOKEN': cookie.value,
      },
    })
  })
})
