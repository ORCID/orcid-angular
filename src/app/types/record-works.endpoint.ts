import {
  ExternalIdentifier,
  MonthDayYearDate,
  Value,
  Visibility,
  VisibilityStrings,
} from './common.endpoint'
import { AssertionBase } from './record.endpoint'

export interface Work extends AssertionBase {
  publicationDate: MonthDayYearDate
  shortDescription?: any
  journalTitle: Value
  languageCode?: any
  languageName?: any
  citation?: Citation
  countryCode?: any
  contributors?: any
  workExternalIdentifiers: ExternalIdentifier[]
  title: Value
  subtitle?: any
  translatedTitle?: any
  workCategory?: any
  workType: Value
  dateSortString?: any
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
