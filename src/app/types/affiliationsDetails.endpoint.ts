import { Value, MonthDayYearDate } from './common.endpoint'

export interface AffiliationsDetails {
  visibility: Value
  errors: any[]
  putCode: Value
  affiliationName: Value
  city: Value
  region: Value
  country: Value
  roleTitle: Value
  countryForDisplay?: any // TODO is this always empty?
  departmentName: Value
  affiliationType: Value
  disambiguatedAffiliationSourceId: Value
  disambiguationSource: Value
  orgDisambiguatedCity?: any // TODO is this always empty?
  orgDisambiguatedCountry?: any // TODO is this always empty?
  orgDisambiguatedId: Value
  orgDisambiguatedName?: any // TODO is this always empty?
  orgDisambiguatedRegion?: any // TODO is this always empty?
  orgDisambiguatedUrl?: any // TODO is this always empty?
  affiliationTypeForDisplay?: any // TODO is this always empty?
  startDate: MonthDayYearDate
  endDate: MonthDayYearDate
  sourceName: string
  source: string
  dateSortString: string
  createdDate: MonthDayYearDate
  lastModified: MonthDayYearDate
  url: Value
  orgDisambiguatedExternalIdentifiers?: any // TODO is this always empty?
  affiliationExternalIdentifiers?: any // TODO is this always empty?
}
