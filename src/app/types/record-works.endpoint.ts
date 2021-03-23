import {
  ExternalIdentifier,
  MonthDayYearDate,
  Value,
  Visibility,
  VisibilityStrings,
} from './common.endpoint'

export interface Work {
  visibility: Visibility
  errors: any[]
  publicationDate: MonthDayYearDate
  putCode: Value
  shortDescription?: any
  url?: any
  journalTitle: Value
  languageCode?: any
  languageName?: any
  citation?: Citation
  countryCode?: any
  countryName?: any
  contributors?: any
  workExternalIdentifiers: ExternalIdentifier[]
  source: string
  sourceName: string
  assertionOriginOrcid?: any
  assertionOriginClientId: string
  assertionOriginName: string
  title: Value
  subtitle?: any
  translatedTitle?: any
  workCategory?: any
  workType: Value
  dateSortString?: any
  createdDate?: any
  lastModified?: any
  userSource: boolean
}

export interface Citation {
  citation: Value
  citationType: Value
  errors: any[]
  getRequiredMessage?: any
  required: boolean
}

export interface WorkGroup {
  activePutCode: number
  defaultPutCode: number
  groupId: number
  activeVisibility: VisibilityStrings
  userVersionPresent: boolean
  externalIdentifiers: ExternalIdentifier[]
  works: Work[]
}

export interface WorksEndpoint {
  nextOffset: number
  totalGroups: number
  groups: WorkGroup[]
}
