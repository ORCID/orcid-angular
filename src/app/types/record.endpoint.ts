import {
  Address,
  Email,
  ExtendedDate,
  Keyword,
  MonthDayYearDate,
  OtherName,
  ResearcherUrl,
  SourceWithAssertionOrigin,
  Value,
  Visibility,
  VisibilityStrings,
} from './common.endpoint'
import { BiographyEndPoint } from './record-biography.endpoint'

interface PublicGroupedKeywords {
  [x: string]: Keyword
}

interface PublicGroupedOtherNames {
  [x: string]: OtherName
}

interface CountryNames {
  [x: string]: string
}

interface PublicGroupedAddresses {
  [x: string]: Address
}

interface PublicGroupedResearcherUrls {
  [x: string]: ResearcherUrl
}

interface PublicGroupedEmails {
  [x: string]: Email
}

export interface PublicGroupedPersonExternalIdentifiers {
  [x: string]: [
    {
      type: string
      value: string
      relationship: string
      url: Value
      source: SourceWithAssertionOrigin
      lastModifiedDate: { value: number }
      createdDate: { value: number }
      putCode: number
      visibility: string
      path?: any
      displayIndex: number
    }
  ]
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

export interface ExternalIdentifier {
  errors: any[]
  externalIdentifiers: Assertion[]
  visibility: Visibility
}

export interface Keywords {
  errors: any[]
  keywords: Assertion[]
  visibility: Visibility
}

export interface Preferences {
  developer_tools_enabled: boolean
  default_visibility: VisibilityStrings
}

export interface AssertionBase {
  value?: string
  primary?: boolean
  current?: boolean
  verified?: boolean
  visibility?: any
  source?: string
  putCode?: any
  errors?: any[]
  displayIndex?: number
  iso2Country?: Value
  countryName?: Value
  commonName?: string
  reference?: string
  url?: Value
  urlName?: string
  sourceName?: string
  content?: string
  professionalEmail?: boolean
  createdDate?: MonthDayYearDate
  lastModified?: MonthDayYearDate
  verificationDate?: MonthDayYearDate
  assertionOriginOrcid?: any
  assertionOriginClientId?: any
  assertionOriginName?: any
}

export interface Assertion extends AssertionBase {
  visibility?: Visibility
}

export interface AssertionVisibilityString extends AssertionBase {
  visibility?: VisibilityStrings
  action?: 'ADD' | 'UPDATE'
  createdDate?: ExtendedDate
}

export interface GroupBase {
  activePutCode: number
  defaultPutCode: number
  groupId: number
  activeVisibility: VisibilityStrings
  userVersionPresent: boolean
  externalIdentifiers: ExternalIdentifier[]
}

export interface ErrorsListResponse {
  errors: string[]
}
