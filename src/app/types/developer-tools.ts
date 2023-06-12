import { Value } from "./common.endpoint"

export interface Client {
  errors?: any[]
  displayName?: Value
  website?: Value
  shortDescription?: Value
  clientId?: Value
  clientSecret?: Value
  type?: Value
  memberId?: Value
  memberName?: any
  authenticationProviderId?: Value
  persistentTokenEnabled?: Value
  redirectUris?: RedirectUri[]
  scopes?: any
  allowAutoDeprecate?: Value
  userOBOEnabled?: Value
  oboEnabled?: Value
}

export interface RedirectUri {
  errors: any[]
  scopes: any[]
  value: Value
  type: Value
  actType: Value
  geoArea: Value
  status: string
  
}


