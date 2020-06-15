import { Value } from './common.endpoint'

export interface RequestInfoForm {
  errors: any[]
  scopes: Scope[]
  clientDescription: string
  clientId: string
  clientName: string
  clientEmailRequestReason: string
  memberName: string
  redirectUrl: string
  responseType: string
  stateParam: string
  userId?: any
  userName?: any
  userOrcid: string
  userEmail: string
  userGivenNames: string
  userFamilyNames: string
  nonce: string
  clientHavePersistentTokens: boolean
  scopesAsString: string
}

export interface Scope {
  name: string
  value: ScopesStrings
  description: string
  longDescription: string
}

export type ScopesStrings =
  | 'openid'
  | '/authenticate'
  | '/person/update'
  | '/activities/update'
  | '/read-limited'

export interface OauthAuthorize {
  userName?: Value // Never used by the frontend
  givenNames?: Value // Never used by the frontend
  familyNames?: Value // Never used by the frontend
  email?: Value // Never used by the frontend
  linkType?: Value // Never used by the frontend
  approved: boolean
  persistentTokenEnabled: boolean
  emailAccessAllowed: boolean
}
