import {
  Contributor,
  ExternalIdentifier,
  MonthDayYearDate,
  Title,
  Value,
  Visibility,
} from './common.endpoint'
import { AssertionBase } from './record.endpoint'

export interface OrganizationDefinedFundingSubType {
  alreadyIndexed: boolean
  subtype: Value
}

export interface FundingGroup {
  fundings: [Funding]
  activePutCode: number
  groupId: string
  activeVisibility: string // TODO is this always empty?
  userVersionPresent: boolean
  externalIdentifiers: [any] // TODO is this always empty?
  defaultFunding: Funding
}

export interface Funding extends AssertionBase {
  visibility: Visibility
  putCode: Value
  fundingTitle: Title
  description: Value
  fundingName: Value
  fundingType: Value
  organizationDefinedFundingSubType: OrganizationDefinedFundingSubType
  currencyCode: Value
  amount: Value
  url: Value
  startDate: MonthDayYearDate
  endDate: MonthDayYearDate
  externalIdentifiers?: ExternalIdentifier[]
  contributors?: Contributor[]
  disambiguatedFundingSourceId: Value
  disambiguationSource: Value
  city: Value
  region: Value
  country: Value
  countryForDisplay?: string
  fundingTypeForDisplay?: string
  dateSortString: string
  fullyLoaded?: boolean
}
