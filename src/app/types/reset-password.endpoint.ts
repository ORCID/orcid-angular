import { Value } from './common.endpoint'

export interface ResetPasswordEmailForm {
  password: Value
  retypedPassword: Value
  encryptedEmail: string
  successRedirectLocation?: string
  errors?: any[]
}
export interface ResetPasswordEmailFormValidate {
  encryptedEmail: string
  errors?: any[]
}
