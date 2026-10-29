import { AuthChallenge, Value } from './common.endpoint'

export interface ResetPasswordEmailForm extends AuthChallenge {
  newPassword: Value
  retypedPassword: Value
  token: string
  successRedirectLocation?: string
  twoFactorEnabled?: boolean
  twoFactorCode?: string
  twoFactorRecoveryCode?: string
  orcid?: string
  errors?: any[]
}
export interface ResetPasswordEmailFormValidate {
  token: string
  errors?: any[]
}
