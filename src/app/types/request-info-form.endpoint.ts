import { ScopesStrings } from './common.endpoint'

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
  error: string
  errorDescription: string
}

export interface Scope {
  name: string
  value: ScopesStrings
  description: string
  longDescription: string
}
