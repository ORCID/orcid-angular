import { AssertionVisibilityString } from '.'

export interface EmailsEndpoint {
  emails: AssertionVisibilityString[]
  emailDomains: AssertionVisibilityString[]
  errors: string[]
}
