import {
  Contributor,
  ExternalIdentifier,
  MonthDayYearDate,
  Value,
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
  contributors?: Contributor[]
  workExternalIdentifiers: ExternalIdentifier[]
  title: Value
  subtitle?: any
  translatedTitle?: any
  workCategory?: any
  workType: Value
  dateSortString?: any
  userSource: boolean
  checked: boolean
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
  checked: boolean
}

export interface WorksEndpoint {
  nextOffset: number
  totalGroups: number
  groups: WorkGroup[]
  pageIndex: number // THIS DATA FIELD IS ATTACHED ON THE FRONTEND
  pageSize: number // THIS DATA FIELD IS ATTACHED ON THE FRONTEND
}
