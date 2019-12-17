export interface Environment {
  protocol: string
  prefix: string
  baseURL: string
  testPrefix: string
  firebaseConfig: {
    apiKey: string
    authDomain: string
    databaseURL: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
    measurementId: string
  }
  ORCID_URLS_TO_AUDIT: {
    url: string
    auth: boolean
    loggedAs?: string
  }[]
  ORCID_ADMIN_USER: string
  ORCID_ADMIN_PASSWORD: string
}
