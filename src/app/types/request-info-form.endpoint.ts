import { Scopes } from './scopes.endpoint'

export interface RequestInfoForm {
  userId: string
  userEmail: string
  userFamilyNames: string
  userGivenNames: string
  scopes: Scopes[]
  state: string
  redirect_uri: string
  response_type: string
  scope: string
  client_id: string
}
