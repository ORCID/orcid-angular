import { Assertion } from '.'

export interface EmailsEndpoint {
  emails: Assertion[]
  errors: string[]
}
