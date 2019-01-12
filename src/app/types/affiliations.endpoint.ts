import { MonthDayYearDate } from './common.endpoint'

export interface Affiliations {
  affiliationGroups: {
    INVITED_POSITION: [AffiliationGroup]
    EMPLOYMENT: [AffiliationGroup]
    EDUCATION: [AffiliationGroup]
    SERVICE: [AffiliationGroup]
    DISTINCTION: [AffiliationGroup]
    MEMBERSHIP: [AffiliationGroup]
    QUALIFICATION: [AffiliationGroup]
  }
}

export enum AffiliationGroupsTypes {
  INVITED_POSITION = 'INVITED_POSITION',
  EMPLOYMENT = 'EMPLOYMENT',
  EDUCATION = 'EDUCATION',
  SERVICE = 'SERVICE',
  DISTINCTION = 'DISTINCTION',
  MEMBERSHIP = 'MEMBERSHIP',
  QUALIFICATION = 'QUALIFICATION',
}

export interface AffiliationGroup {
  affiliations: [Affiliation]
  activePutCode: number
  defaultAffiliation: Affiliation
  groupId: string
  activeVisibility: string // TODO is this always empty?
  userVersionPresent: boolean
  externalIdentifiers: [any] // TODO is this always empty?
  affiliationType: string // Todo make an enum
}

export interface Affiliation {
  visibility: Visibility
  errors: [any] // TODO is this always empty?
  putCode: Value
  affiliationName: Value
  city: Value
  region: Value
  country: Value
  roleTitle: Value
  countryForDisplay: {} // TODO is this always empty?
  departmentName: Value
  disambiguatedAffiliationSourceId: Value
  disambiguationSource: Value
  orgDisambiguatedCity: {} // TODO is this always empty?
  orgDisambiguatedCountry: {} // TODO is this always empty?
  orgDisambiguatedId: Value
  orgDisambiguatedName: {} // TODO is this always empty?
  orgDisambiguatedRegion: {} // TODO is this always empty?
  orgDisambiguatedUrl: {} // TODO is this always empty?
  affiliationTypeForDisplay: {} // TODO is this always empty?
  startDate: {}
  endDate: {}
  sourceName: string
  source: string
  dateSortString: string
  createdDate: MonthDayYearDate
  lastModified: MonthDayYearDate
  url: Value
  orgDisambiguatedExternalIdentifiers: {} // pTODO is this always empty?
  affiliationExternalIdentifiers: {} // TODO is this always empty?
}

export interface Visibility {
  errors: [any] // populate with data
  required: boolean
  getRequiredMessage: any
  visibility: string // Todo make an enum
}

export interface Value {
  errors: [any] // TODO is this always empty?
  value: string
  required: boolean
  getRequiredMessage: any
}
