import { Value } from './common.endpoint'

export interface OauthAuthorize {
  userName?: string // Never used by the frontend
  password?: string // Never used by the frontend
  givenNames?: Value // Never used by the frontend
  familyNames?: Value // Never used by the frontend
  email?: Value // Never used by the frontend
  linkType?: Value // Never used by the frontend
  approved: boolean
  persistentTokenEnabled: boolean
  emailAccessAllowed: boolean
}

export interface ValidateRedirectUriResponse {
  clientId: string
  redirectUri: string
  valid: boolean
}
