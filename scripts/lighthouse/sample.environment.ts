import { Environment } from './types'

export const environment: Environment = {
  protocol: 'https://',
  prefix: '',
  baseURL: 'orcid.org',
  testPrefix: 'sample',
  firebaseConfig: {
    apiKey: '****',
    authDomain: '****',
    databaseURL: '****',
    projectId: '****',
    storageBucket: '****',
    messagingSenderId: '****',
    appId: '****',
    measurementId: '****',
  },
  ORCID_URLS_TO_AUDIT: [
    {
      url: 'orcid.org',
      auth: false,
    },
    {
      url: 'my-orcid',
      auth: true,
      loggedAs: '****-****-****-****',
    },
  ],
  ORCID_ADMIN_USER: '****',
  ORCID_ADMIN_PASSWORD: '****',
}
