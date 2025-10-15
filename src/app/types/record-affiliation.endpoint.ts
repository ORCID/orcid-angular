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
  EDITORIAL_SERVICE = 'EDITORIAL_SERVICE',
}

export interface AffiliationsEndpoint {
  affiliationGroups: {
    INVITED_POSITION?: AffiliationGroup[]
    EMPLOYMENT?: AffiliationGroup[]
    EDUCATION?: AffiliationGroup[]
    SERVICE?: AffiliationGroup[]
    EDITORIAL_SERVICE?: AffiliationGroup[]
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
  PROFESSIONAL_ACTIVITIES = 'PROFESSIONAL_ACTIVITIES',
}

export interface AffiliationUIGroup {
  type: string
  affiliationGroup: AffiliationGroup[]
}

export interface AffiliationGroup {
  affiliations: Affiliation[]
  activePutCode: number
  defaultAffiliation: Affiliation
  groupId: string
  activeVisibility: string // TODO is this always empty?
  userVersionPresent: boolean
  externalIdentifiers: ExternalIdentifier[]
  affiliationType: AffiliationGroupsTypes
}

export interface Affiliation extends AssertionBase {
  visibility: Visibility
  putCode: Value
  affiliationName?: Value
  city?: Value
  region?: Value
  country?: Value
  roleTitle: Value
  countryForDisplay?: any // TODO is this always empty?
  departmentName: Value
  affiliationType: AffiliationTypeValue
  disambiguatedAffiliationSourceId?: Value
  disambiguationSource?: Value
  orgDisambiguatedCity?: any // TODO is this always empty?
  orgDisambiguatedCountry?: any // TODO is this always empty?
  orgDisambiguatedId?: Value
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
  organization?: Organization
  userIsSource?: boolean
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
  name?: string
}

export interface DisambiguatedOrganization {
  sourceId: string
  country: string
  orgType: string
  countryForDisplay: string
  disambiguatedAffiliationIdentifier?: any
  city: string
  sourceType: string
  region: string
  value: string
  url?: string
  affiliationKey: string
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
  'editorial-service' = 'editorial-service',
  'professional-activities' = 'professional-activities',
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
  [AffiliationType['editorial-service']]: $localize`:@@shared.editorialService:Editorial Service`,
}

export interface EmploymentsEndpoint {
  lastModifiedDate: string
  path: string
  employmentGroups: EmploymentGroups[]
}

export interface EmploymentGroups {
  lastModifiedDate: string
  identifiers: string
  activities: Affiliation[]
}
