export const environment = {
  baseUrl: 'https://dev.orcid.org',
  testUser: {
    // A no-admin
    username: 'xxx@xxx.com', // email or orcid to login
    password: 'xxxxx',
    displayName: 'xxxx', // the name shown publicly
  },
  // an app own by a locked member
  lockedApp: { id: 'APP-XXXXXXXXXXXX' },
  // a working (no premium) app
  validApp: {
    id: 'APP-XXXXXXXXXXXX',
    redirectUrl: 'https://developers.google.com/oauthplayground',
    name: 'XXXXXXXXXXXX',
  },
  // user information used to be autofill on Oauth request
  // make user the provided email does not exist on your environment
  notYetRegisteredUser: {
    familyNames: `XXXXXXXXXXXX`,
    givenNames: `XXXXXXXXXXXX`,
    email: `XXXXXXXXXXXX@XXXXXXXXXXXX.com`,
  },
}
