import { TwoFactorAuthForm } from './common.endpoint'

export interface AccountPasswordEndpoint extends TwoFactorAuthForm {
  errors: string[]
  password: string
  retypedPassword: string
  oldPassword: string
  success?: boolean
}
