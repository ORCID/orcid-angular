import { Value } from "./common.endpoint"


export interface ResetPasswordEmailForm {
  password: Value
  retypedPassword: Value
  encryptedEmail: string
  successRedirectLocation?: any
  errors?: any[]
}
