import { AuthChallenge, Value } from './common.endpoint'

export interface ResetPasswordEmailForm extends AuthChallenge {
  newPassword: Value
  retypedPassword: Value
  encryptedEmail: string
  successRedirectLocation?: string
  twoFactorEnabled?: boolean
  twoFactorCode?: string
  twoFactorRecoveryCode?: string
  orcid?: string
  errors?: any[]
}
export interface ResetPasswordEmailFormValidate {
  encryptedEmail: string
  errors?: any[]
}
