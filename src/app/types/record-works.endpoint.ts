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
  shortDescription?: Value
  journalTitle: Value
  languageCode?: Value
  languageName?: Value
  citation?: Citation
  countryCode?: Value
  contributors?: Contributor[]
  workExternalIdentifiers: ExternalIdentifier[]
  title: Value
  subtitle?: Value
  translatedTitle?: TranslatedTitle
  workCategory?: Value
  workType: Value
  dateSortString?: MonthDayYearDate
  userSource?: boolean
}

export interface TranslatedTitle {
  errors?: any
  content?: string
  languageCode?: string
  languageName?: string
  required?: false
  getRequiredMessage?: null
  dateSortString?: any
  userSource?: boolean
  checked?: boolean
}

export interface Citation {
  citation: Value
  citationType: Value
  errors?: any[]
  getRequiredMessage?: any
  required?: boolean
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

