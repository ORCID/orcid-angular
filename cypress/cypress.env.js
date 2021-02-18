// The following file should work as it is on QA.
// Feel free to change it on your own environment file

export const environment = {
  // environment urls
  baseUrl: 'https://dev.orcid.org',
  infoSiteBaseUrl: 'https://info.qa.orcid.org',

  //  weather the togglz for the new info site is enable
  newInfoSiteEnable: false,

  // a regular user
  testUser: {
    name: 'Daniel',
    familyName: 'Palafox',
    displayName: 'The artists',
    email: 'user_2@test.orcid.org',
    password: 'password',
    id: '9999-0000-0000-0005',
    defaultPrivacy: 'LIMITED', // IT IS REQUIRE THAT TEST USER HAS LIMITED AS THE DEFAULT PRIVACY SETTING
  },

  // a working application
  // the `testUser` should not have authorized and neither will authorize this application during testing
  validApp: {
    id: 'APP-MLXS7JVFJS9FEIFJ',
    redirectUrl: 'https://developers.google.com/oauthplayground',
    name: 'Healthy client for e2e',
    memberName: 'Healthy member for e2e',
  },

  // an app (client) own by a locked member
  lockedApp: { id: 'APP-0X2R288COCXIA4UR' },

  // user information that does not exists on the environment
  // this should not be registered neither will be registered during testing  \
  notYetRegisteredUser: {
    familyNames: `adnasdjnoasijdnasdn asodkaps`,
    givenNames: `saodasnnapsi  asiiaiaia`,
    email: `asdasd+asdasd+aasdasd@test.com`,
  },
}
