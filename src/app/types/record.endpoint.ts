import { Address, Email, MonthDayYearDate, OtherName, ResearcherUrl, Value, Visibility, VisibilityStrings } from './common.endpoint'
import { BiographyEndPoint } from './record-biography.endpoint'

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
  biography: BiographyEndPoint
  publicGroupedOtherNames: PublicGroupedOtherNames
  publicAddress: Address
  countryNames: CountryNames
  publicGroupedAddresses: PublicGroupedAddresses
  publicGroupedKeywords: PublicGroupedKeywords
  publicGroupedResearcherUrls: PublicGroupedResearcherUrls
  publicGroupedEmails: PublicGroupedEmails
  publicGroupedPersonExternalIdentifiers: PublicGroupedPersonExternalIdentifiers
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

export interface Preferences {
  developer_tools_enabled: boolean
  default_visibility: VisibilityStrings
}

export interface Assertion {
  value: string
  primary: boolean
  current: boolean
  verified: boolean
  visibility: Visibility | VisibilityStrings
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
  sourceName: string
  content?: string
  createdDate: MonthDayYearDate
  lastModified: MonthDayYearDate
  assertionOriginOrcid?: any
  assertionOriginClientId?: any
  assertionOriginName?: any
}

export interface ErrorsListResponse {
  errors: string[]
}
