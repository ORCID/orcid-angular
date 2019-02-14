import { MonthDayYearDate, Value } from './common.endpoint'

export enum AffiliationGroupsTypes {
  EMPLOYMENT = 'EMPLOYMENT',
  EDUCATION = 'EDUCATION',
  QUALIFICATION = 'QUALIFICATION',
  INVITED_POSITION = 'INVITED_POSITION',
  DISTINCTION = 'DISTINCTION',
  MEMBERSHIP = 'MEMBERSHIP',
  SERVICE = 'SERVICE',
}

export interface Affiliations {
  affiliationGroups: {
    INVITED_POSITION?: AffiliationGroup[]
    EMPLOYMENT?: AffiliationGroup[]
    EDUCATION?: AffiliationGroup[]
    SERVICE?: AffiliationGroup[]
    DISTINCTION?: AffiliationGroup[]
    MEMBERSHIP?: AffiliationGroup[]
    QUALIFICATION?: AffiliationGroup[]
  }
}

export enum AffiliationUIGroupsTypes {
  EMPLOYMENT = 'EMPLOYMENT',
  EDUCATION_AND_QUALIFICATION = 'EDUCATION_AND_QUALIFICATION',
  INVITED_POSITION_AND_DISTINCTION = 'INVITED_POSITION_AND_DISTINCTION',
  MEMBERSHIP_AND_SERVICE = 'MEMBERSHIP_AND_SERVICE',
}

export interface AffiliationUIGroup {
  type: string
  affiliationGroup: AffiliationGroup[]
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
  startDate: MonthDayYearDate
  endDate: MonthDayYearDate
  sourceName: string
  source: string
  dateSortString: string
  createdDate: MonthDayYearDate
  lastModified: MonthDayYearDate
  url: Value
  orgDisambiguatedExternalIdentifiers: {} // TODO is this always empty?
  affiliationExternalIdentifiers: {} // TODO is this always empty?
  affiliationType: Value
}

export interface Visibility {
  errors: [any] // TODO define object
  required: boolean
  getRequiredMessage: any
  visibility: string // Todo make an enum
}
