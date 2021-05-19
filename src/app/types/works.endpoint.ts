import { ExternalIdentifier, MonthDayYearDate, Value } from './common.endpoint'
import { GroupBase } from './record.endpoint'

export interface Works {
  nextOffset: number
  totalGroups: number
  groups: WorkGroup[]
}

export interface WorkGroup extends GroupBase {
  works: Work[]
}

export interface Citation {
  citation: Value
  citationType: Value
  errors: any[]
  getRequiredMessage?: any
  required: boolean
}

export interface Work {
  visibility: Value
  errors: any[] // TODO is this always empty?
  publicationDate: MonthDayYearDate
  putCode: Value
  shortDescription?: Value
  url?: Value
  journalTitle?: Value
  languageCode?: Value
  languageName?: Value
  citation?: Citation
  countryCode?: Value
  countryName?: Value
  contributors?: [any] // TODO is this always empty?
  workExternalIdentifiers: ExternalIdentifier[]
  source: string
  sourceName: string
  title: Value
  subtitle?: Value
  translatedTitle?: any // TODO is this always empty?
  workCategory?: Value
  workType: Value
  dateSortString?: string
  createdDate?: MonthDayYearDate
  lastModified?: MonthDayYearDate
  userSource: boolean
}
