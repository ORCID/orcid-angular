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
