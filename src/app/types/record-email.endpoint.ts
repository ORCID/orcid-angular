import { AssertionVisibilityString } from '.'

export interface EmailsEndpoint {
  emails: AssertionVisibilityString[]
  errors: string[]
}
