import { AuthChallenge } from './common.endpoint'

export interface AccountPasswordEndpoint extends AuthChallenge {
  errors: string[]
  password: string
  retypedPassword: string
  oldPassword: string
  success?: boolean
  passwordContainsEmail?: boolean
}
