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

Cypress.Commands.add('cleanBiography', (url) => {
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
Cypress.Commands.add('cleanWebsites', () => {
  cy.getCookie('XSRF-TOKEN').then((cookie) => {
    cy.request({
      method: 'POST',
      url: '/my-orcid/websitesForms.json', // baseUrl is prepended to url
      body: {
        errors: [],
        websites: [],
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
