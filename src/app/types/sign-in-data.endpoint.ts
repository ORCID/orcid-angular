export interface SignInData {
  entityID: string
  accountId: string
  accountIdEncoded: string
  email: string
  emailEncoded: string
  firstName: string
  firstNameEncoded: string
  headerCheckFailed: boolean
  institutionContactEmail: string
  lastName: string
  lastNameEncoded: string
  linkType: string
  providerId: string
  providerIdEncoded: string
  unsupportedInstitution: boolean
}

export interface SignInDataWithEntityName {
  signinData: SignInData
  entityDisplayName: string
}
