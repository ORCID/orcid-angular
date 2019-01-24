import { Value, MonthDayYearDate } from './common.endpoint'

export interface Works {
  nextOffset: number
  totalGroups: number
  groups: WorkGroup[]
}

export interface WorkGroup {
  activePutCode: number
  defaultPutCode: number
  groupId: number
  activeVisibility: string
  userVersionPresent: boolean
  externalIdentifiers: ExternalIdentifier[]
  works: Work[]
}

export interface ExternalIdentifier {
  errors: any[]
  externalIdentifierId: ExternalIdentifierId
  externalIdentifierType: Value
  url: Value
  relationship: Value
  normalized: Value
  normalizedUrl: Value
}

export interface ExternalIdentifierId {
  errors: any[]
  value: string
  required: boolean
  getRequiredMessage?: any
}

export interface Work {
  visibility: Value
  errors: any[]
  publicationDate: MonthDayYearDate
  putCode: Value
  shortDescription?: any
  url?: any
  journalTitle?: any
  languageCode?: any
  languageName?: any
  citation?: any
  countryCode?: any
  countryName?: any
  contributors?: any
  workExternalIdentifiers: WorkExternalIdentifier[]
  source: string
  sourceName: string
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

export interface WorkExternalIdentifier {
  errors: any[]
  externalIdentifierId: Value
  externalIdentifierType: Value
  url: Value
  relationship: Value
  normalized: Value
  normalizedUrl: Value
}
