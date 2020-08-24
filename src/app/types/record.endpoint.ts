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

export interface Emails {
  emails: {
    value: string
    primary: boolean
    current: boolean
    verified: boolean
    visibility: VisibilityStrings
    source: string
    sourceName?: any
    assertionOriginOrcid?: any
    assertionOriginClientId?: any
    assertionOriginName?: any
    errors: any[]
  }[]
  errors: string[]
}
export interface OtherNames {
  errors: String[]
  otherNames: {
    visibility: Visibility
    errors: any[]
    content: string
    putCode: string
    displayIndex: number
    createdDate: MonthDayYearDate
    lastModified: MonthDayYearDate
    source: string
    sourceName: string
    assertionOriginOrcid?: any
    assertionOriginClientId: string
    assertionOriginName: string
  }[]
  visibility: Visibility
}

export interface Countries {
  errors: string[]
  addresses: {
    visibility: Visibility
    errors: any[]
    iso2Country: Value
    countryName: string
    putCode: string
    displayIndex: number
    createdDate: MonthDayYearDate
    lastModified: MonthDayYearDate
    source: string
    sourceName: string
    assertionOriginOrcid?: any
    assertionOriginClientId?: any
    assertionOriginName?: any
  }[]
  visibility: Visibility
}

export interface Keywords {
  errors: any[]
  keywords: {
    visibility: Visibility
    errors: any[]
    putCode: string
    content: string
    displayIndex: number
    createdDate: MonthDayYearDate
    lastModified: MonthDayYearDate
    source: string
    sourceName: string
    assertionOriginOrcid?: any
    assertionOriginClientId?: any
    assertionOriginName?: any
  }[]
  visibility: Visibility
}

export interface Website {
  errors: any[]
  websites: {
    visibility: Visibility
    errors: any[]
    url: Value
    urlName: string
    putCode: string
    displayIndex: number
    createdDate: MonthDayYearDate
    lastModified: MonthDayYearDate
    source: string
    sourceName: string
    assertionOriginOrcid?: any
    assertionOriginClientId?: any
    assertionOriginName?: any
  }[]
  visibility: Visibility
}

export interface ExternalIdentifier {
  errors: any[]
  externalIdentifiers: {
    visibility: Visibility
    errors: any[]
    commonName: string
    reference: string
    url: string
    source: string
    sourceName: string
    displayIndex: number
    putCode: string
    createdDate: MonthDayYearDate
    lastModified: MonthDayYearDate
    assertionOriginOrcid?: any
    assertionOriginClientId?: any
    assertionOriginName?: any
  }[]
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
