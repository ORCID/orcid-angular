import { Assertion } from '.';
import { MonthDayYearDate, Value, Visibility } from './common.endpoint'

export interface PersonIdentifierEndpoint {
  errors: string[]
  externalIdentifiers: Assertion[]
  visibility: Visibility
}
