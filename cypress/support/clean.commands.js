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

Cypress.Commands.add('cleanCountries', (url) => {
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

Cypress.Commands.add('cleanNames', () => {
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

Cypress.Commands.add('cleanOtherNames', () => {
  cy.getCookie('XSRF-TOKEN').then((cookie) => {
    cy.request({
      method: 'POST',
      url: '/my-orcid/otherNamesForms.json', // baseUrl is prepended to url
      body: {
        errors: [],
        otherNames: [],
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
