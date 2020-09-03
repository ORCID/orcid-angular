import { RequestInfoForm } from '../types'

export function oauthSessionHasError(value: RequestInfoForm) {
  return value.error || value.errors.length
}

export function oauthSessionUserIsLoggedIn(value: RequestInfoForm) {
  return value.userOrcid && value.userName
}
