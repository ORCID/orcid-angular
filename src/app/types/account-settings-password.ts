import { AuthChallengeForm } from './common.endpoint'

export interface AccountPasswordEndpoint extends AuthChallengeForm {
  errors: string[]
  password: string
  retypedPassword: string
  oldPassword: string
  success?: boolean
  passwordContainsEmail?: boolean
}
