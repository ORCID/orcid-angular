import { Assertion } from './record.endpoint'
import { Visibility } from './common.endpoint'

export interface KeywordEndPoint {
  errors: String[]
  keywords: Assertion[]
  visibility: Visibility
}
