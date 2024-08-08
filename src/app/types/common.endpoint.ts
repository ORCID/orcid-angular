import { WorkRelationships } from './works.endpoint'

export interface LastModifiedDate {
  value: number
}

export interface CreatedDate {
  value: number
}

export interface SourceName {
  content: string
}

export interface Source {
  sourceOrcid?: SourceOrcid
  sourceClientId?: any
  sourceName: SourceName
}

export interface SourceWithAssertionOrigin {
  sourceOrcid?: any
  sourceClientId: SourceOrcid
  sourceName: SourceName
  assertionOriginOrcid?: any
  assertionOriginClientId?: any
  assertionOriginName?: any
}

export interface Keyword {
  content: string
  source: Source
  putCode: number
  lastModifiedDate: LastModifiedDate
  createdDate: CreatedDate
  visibility: string
  path?: any
  displayIndex: number
}

export interface OtherName {
  content: string
  source: Source
  putCode: number
  lastModifiedDate: LastModifiedDate
  createdDate: CreatedDate
  visibility: string
  path?: any
  displayIndex: number
}

export interface Country {
  [x: string]: any // TODO: DEFINE
}

export interface Address {
  country: Country
  source: Source
  putCode: number
  lastModifiedDate: LastModifiedDate
  createdDate: CreatedDate
  visibility: string
  path?: any
  displayIndex: number
}

export interface Url {
  value: string
}

export interface ResearcherUrl {
  urlName: string
  url: Url
  source: Source
  putCode: number
  lastModifiedDate: LastModifiedDate
  createdDate: CreatedDate
  visibility: string
  path?: any
  displayIndex: number
}

export interface SourceOrcid {
  uri: string
  path: string
  host: string
}

export interface Email {
  email: string
  source: Source
  lastModifiedDate: LastModifiedDate
  createdDate: CreatedDate
  putCode?: any
  path?: any
  visibility: string
  verified: boolean
  primary: boolean
}

export interface MonthDayYearDate {
  errors?: any[] // TODO define object
  day?: string
  month?: string
  year?: string
  required?: boolean
  getRequiredMessage?: any
}

export interface ExtendedDate {
  errors?: any[]
  day?: string
  month?: string
  year?: string
  timestamp?: number
  required?: boolean
  getRequiredMessage?: any
}

export interface Value {
  errors?: any[] // TODO is this always empty?
  value: string
  required?: boolean
  getRequiredMessage?: any
}

export interface Visibility {
  errors?: any[] // TODO is this always empty?
  required?: boolean
  getRequiredMessage?: any
  visibility: VisibilityStrings
}

export interface ExternalIdentifier {
  errors: any[]
  externalIdentifierId: ExternalIdentifierId
  externalIdentifierType: Value
  url: Value
  relationship: RelationshipValue
  normalized: Value
  normalizedUrl: Value
}

export interface RelationshipValue {
  errors?: any[] // TODO is this always empty?
  value: WorkRelationships
  required?: boolean
  getRequiredMessage?: any
}

export interface ExternalIdentifierId {
  errors: any[]
  value: string
  required: boolean
  getRequiredMessage?: any
}

export interface Contributor {
  errors?: any[]
  contributorSequence?: Value
  contributorEmail?: Value
  contributorOrcid?: ContributorOrcid
  email?: Value
  orcid?: Value
  uri?: Value
  creditName?: any
  contributorRole?: any
  rolesAndSequences?: RolesAndSequences[]
}

export interface ContributorOrcid {
  path?: string
  uri: string
}

export interface RolesAndSequences {
  contributorRole?: string
  contributorSequence?: string
}

export interface Title {
  errors: any[]
  title: Value
  translatedTitle?: TranslatedTitle
}

export interface TranslatedTitle {
  errors: any[]
  content: string
  languageCode?: string
  languageName?: string
}

export interface Organization {
  affiliationKey: string
  city: string
  country: string
  countryForDisplay: string
  disambiguatedFundingSourceId?: string
  disambiguatedAffiliationIdentifier?: string
  orgType: string
  region: string
  sourceId: string
  sourceType: string
  url: string
  value: string
}

export type ScopesStrings =
  | 'openid'
  | '/authenticate'
  | '/person/update'
  | '/activities/update'
  | '/read-limited'

export type VisibilityStrings = 'PUBLIC' | 'LIMITED' | 'PRIVATE'

export const VisibilityWeightMap: { [key in VisibilityStrings]: number } = {
  PUBLIC: 0,
  LIMITED: 1,
  PRIVATE: 2,
}

export const VisibilityStringLabel = {
  PUBLIC: $localize`:@@shared.everyone:Everyone`,
  LIMITED: $localize`:@@shared.trustedParties:Trusted parties`,
  PRIVATE: $localize`:@@shared.onlyMe:Only me`,
}

export type DeprecatedScopesStrings =
  | '/orcid-works/read-limited'
  | '/orcid-bio/read-limited'
  | '/orcid-profile/read-limited'
  | '/person/read-limited' // NOT DOCUMENTED
  | '/activities/read-limited' // NOT DOCUMENTED
  //
  | '/orcid-works/create'
  | '/affiliations/create'
  | '/funding/create'
  | '/orcid-bio/external-identifiers/create'
  //
  | '/orcid-works/update'
  | '/orcid-bio/update'
  | '/affiliations/update'
  | '/funding/update'
  | '/orcid-bio/external-identifiers/update'
