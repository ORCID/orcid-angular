export const environment = {
  baseUrl: 'https://qa.orcid.org',
  infoSiteBaseUrl: 'http://orcidaboutdev.wpengine.com',
  testUser: {
    username: 'cy-Nov-04-2020-01-18-PM-jQ@gmail.com',
    password: '12345678Aa',
    displayName: 'cy-Nov-04-2020-01-18-PM-K全 cy-Nov-04-2020-01-18-PM-Uz',
  },
  lockedApp: { id: 'APP-0X2R288COCXIA4UR' },
  validApp: {
    id: 'APP-MLXS7JVFJS9FEIFJ',
    redirectUrl: 'https://developers.google.com/oauthplayground',
    name: 'Healthy client for e2e',
    memberName: 'Healthy member for e2e',
  },
  notYetRegisteredUser: {
    familyNames: `StrangeNameSoItDoesNoTExistOnDB`,
    givenNames: `StrangeNameSoItDoesNoTExistOnDB`,
    email: `asdasd+asdasd+aasdasd@test.com`,
  },
}
