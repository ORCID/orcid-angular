import { Assertion } from './record.endpoint'
import { Visibility } from './common.endpoint'

export interface OtherNamesEndPoint {
  errors: String[]
  otherNames: Assertion[]
  visibility: Visibility
}
