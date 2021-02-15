import {
  Address,
  Email,
  OtherName,
  ResearcherUrl,
  Visibility,
  MonthDayYearDate,
  VisibilityStrings,
  Value,
} from './common.endpoint'

interface PublicGroupedOtherNames {
  [x: string]: OtherName
}

interface CountryNames {
  [x: string]: string
}

interface PublicGroupedAddresses {
  [x: string]: Address
}

interface PublicGroupedKeywords {
  [x: string]: any // TODO: DEFINE
}

interface PublicGroupedResearcherUrls {
  [x: string]: ResearcherUrl
}

interface PublicGroupedEmails {
  [x: string]: Email
}

interface PublicGroupedPersonExternalIdentifiers {
  [x: string]: any // TODO: DEFINE
}

export interface Person {
  title: string
  displayName: string
  biography: Biography
  publicGroupedOtherNames: PublicGroupedOtherNames
  publicAddress: Address
  countryNames: CountryNames
  publicGroupedAddresses: PublicGroupedAddresses
  publicGroupedKeywords: PublicGroupedKeywords
  publicGroupedResearcherUrls: PublicGroupedResearcherUrls
  publicGroupedEmails: PublicGroupedEmails
  publicGroupedPersonExternalIdentifiers: PublicGroupedPersonExternalIdentifiers
}

export interface Biography {
  visibility: Visibility
  biography: Value
  errors: string[]
}

export interface OtherNames {
  errors: String[]
  otherNames: Assertion[]
  visibility: Visibility
}

export interface Keywords {
  errors: any[]
  keywords: Assertion[]
  visibility: Visibility
}

export interface Website {
  errors: any[]
  websites: Assertion[]
  visibility: Visibility
}

export interface ExternalIdentifier {
  errors: any[]
  externalIdentifiers: Assertion[]
  visibility: Visibility
}

export interface Names {
  visibility: Visibility
  errors: any[]
  givenNames: Value
  familyName: Value
  creditName?: any
}

export interface Preferences {
  developer_tools_enabled: boolean
  default_visibility: VisibilityStrings
}

export interface Assertion {
  value: string
  primary: boolean
  current: boolean
  verified: boolean
  visibility: VisibilityStrings
  source: string
  putCode?: string
  createdDate?: MonthDayYearDate
  errors?: any[]
  lastModified?: MonthDayYearDate
  displayIndex?: number
  iso2Country?: Value
  countryName?: string
  commonName?: string
  reference?: string
  url?: string | Value
  urlName?: string
  content?: string
  sourceName?: string
  assertionOriginOrcid?: any
  assertionOriginClientId?: any
  assertionOriginName?: any
}

export interface ErrorsListResponse {
  errors: string[]
}
