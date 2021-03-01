import { Visibility } from './common.endpoint'
import { Assertion } from './record.endpoint'

export interface WebsitesEndPoint {
  errors: any[]
  websites: Assertion[]
  visibility: Visibility
}
