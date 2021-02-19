import { Assertion } from './record.endpoint'
import { Visibility } from './common.endpoint'

export interface KeywordEndPoint {
  errors: String[]
  Keywords: Assertion[]
  visibility: Visibility
}
