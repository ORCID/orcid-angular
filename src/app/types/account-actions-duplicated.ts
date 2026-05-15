import { AuthChallenge } from './common.endpoint'

export interface DuplicateRemoveEndpoint extends AuthChallenge {
  deprecatingEmails?: string[]
  deprecatingPassword: string
  errors?: any[]
  deprecatingAccountName?: string
  deprecatingOrcidOrEmail: string
  deprecatingOrcid?: string
  primaryEmails?: string[]
  primaryOrcid?: string
  primaryAccountName?: string
  twoFactorToken?: string
  verificationCodeRequired?: boolean
}
