import { RequestInfoForm } from '../types'

export function oauthSessionHasError(value: RequestInfoForm) {
  return value.errors.length || value.error
}

export function oauthSessionUserIsLoggedIn(value: RequestInfoForm) {
  return value.userOrcid && value.userName
}
