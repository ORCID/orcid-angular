import { RequestInfoForm } from '../types'

export function oauthSectionHasError(value: RequestInfoForm) {
  return value.errors.length || value.error
}

export function oauthSectionUserIsLoggedIn(value: RequestInfoForm) {
  return value.userOrcid && value.userName
}
