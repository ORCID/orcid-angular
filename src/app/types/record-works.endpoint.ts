import {
  ExternalIdentifier,
  MonthDayYearDate,
  Value,
  Visibility,
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
  citation?: any
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

export interface WorkGroup {
  activePutCode: number
  defaultPutCode: string
  groupId: number
  activeVisibility: string
  userVersionPresent: boolean
  externalIdentifiers: ExternalIdentifier[]
  works: Work[]
}

export interface WorksEndpoint {
  nextOffset: number
  totalGroups: number
  groups: WorkGroup[]
}
