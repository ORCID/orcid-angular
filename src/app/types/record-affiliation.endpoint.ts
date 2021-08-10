import {
  ExternalIdentifier,
  MonthDayYearDate,
  Value,
  Visibility,
} from './common.endpoint'
import { AssertionBase } from './record.endpoint'

export enum AffiliationGroupsTypes {
  EMPLOYMENT = 'EMPLOYMENT',
  EDUCATION = 'EDUCATION',
  QUALIFICATION = 'QUALIFICATION',
  INVITED_POSITION = 'INVITED_POSITION',
  DISTINCTION = 'DISTINCTION',
  MEMBERSHIP = 'MEMBERSHIP',
  SERVICE = 'SERVICE',
}

export interface AffiliationsEndpoint {
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

export interface Affiliation extends AssertionBase {
  visibility: Visibility
  putCode: Value
  affiliationName: Value
  city: Value
  region: Value
  country: Value
  roleTitle: Value
  countryForDisplay?: any // TODO is this always empty?
  departmentName: Value
  affiliationType: AffiliationTypeValue
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
  dateSortString: string
  url: Value
  orgDisambiguatedExternalIdentifiers?: any // TODO is this always empty?
  affiliationExternalIdentifiers?: ExternalIdentifier[]
}

export interface Organization {
  affiliationKey: string
  city: string
  country: string
  countryForDisplay: string
  disambiguatedAffiliationIdentifier: string
  orgType: string
  region: string
  sourceId: string
  sourceType: string
  url: string
  value: string
}

export interface AffiliationTypeValue {
  errors?: any[]
  value: AffiliationType
  required?: boolean
  getRequiredMessage?: any
}

export enum AffiliationType {
  'employment' = 'employment',
  'education' = 'education',
  'qualification' = 'qualification',
  'invited-position' = 'invited-position',
  'distinction' = 'distinction',
  'membership' = 'membership',
  'service' = 'service',
}

export const AffiliationTypeLabel = {
  [AffiliationType.employment]: $localize`:@@shared.employment:Employment`,
  [AffiliationType.education]: $localize`:@@shared.education:Education`,
  [AffiliationType.qualification]: $localize`:@@shared.qualification:Qualification`,
  [AffiliationType[
    'invited-position'
  ]]: $localize`:@@shared.invitedSentenceCase:Invited position`,
  [AffiliationType.distinction]: $localize`:@@shared.distinction:Distinction`,
  [AffiliationType.membership]: $localize`:@@shared.membershipTitle:Membership`,
  [AffiliationType.service]: $localize`:@@shared.service:Service`,
}
