import { Value, VisibilityStrings } from './common.endpoint'

export interface NamesEndPoint {
  visibility: VisibilityStrings
  errors: any[]
  givenNames: Value
  familyName: Value
  creditName?: any
}
