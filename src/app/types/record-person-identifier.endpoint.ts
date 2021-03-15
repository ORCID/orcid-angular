import { Assertion } from '.'
import { Visibility } from './common.endpoint'

export interface PersonIdentifierEndpoint {
  errors: string[]
  externalIdentifiers: Assertion[]
  visibility: Visibility
}
