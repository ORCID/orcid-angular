import {
  ExternalIdentifier,
  MonthDayYearDate,
  Value,
  Visibility,
} from './common.endpoint' 

export interface FundingGroup {
  fundings: [Funding]
  activePutCode: number
  groupId: string
  activeVisibility: string // TODO is this always empty?
  userVersionPresent: boolean
  externalIdentifiers: [any] // TODO is this always empty? 
  defaultFunding: Funding 
}

export interface Funding {
  visibility: Visibility
  errors: any[]
  putCode: Value
  title: Value
  translatedTitle: Value
  description: Value
  fundingName: Value
  fundingType: Value
  organizationDefinedFundingSubType: Value
  currencyCode: Value
  amount: Value 
  url: Value
  startDate: MonthDayYearDate
  endDate: MonthDayYearDate
  externalIdentifiers?: ExternalIdentifier[]
  sourceName: string
  source: string
  disambiguatedFundingSourceId: Value
  disambiguationSource: Value
  city: Value
  region: Value
  country: Value
  countryForDisplay?: string // TODO is this always empty?
  fundingTypeForDisplay?: string 
  dateSortString: string
  createdDate: MonthDayYearDate
  lastModified: MonthDayYearDate
}
