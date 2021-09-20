import { Value, Visibility } from './common.endpoint'

export interface NamesEndPoint {
  visibility: Visibility
  errors: any[]
  givenNames: Value
  familyName: Value
  creditName?: any
}
