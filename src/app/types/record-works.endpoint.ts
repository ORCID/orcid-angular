import {
  Contributor,
  ExternalIdentifier,
  MonthDayYearDate,
  Value,
  Visibility,
  VisibilityStrings,
} from './common.endpoint'
import { AssertionBase } from './record.endpoint'
import { WorkTypes } from './works.endpoint'


export interface Work extends AssertionBase {
  publicationDate: MonthDayYearDate
  shortDescription?: Value
  journalTitle: Value
  languageCode?: Value
  languageName?: Value
  citation?: Citation
  countryCode?: Value
  contributors?: Contributor[]
  numberOfContributors?: number
  contributorsGroupedByOrcid?: Contributor[]
  workExternalIdentifiers: ExternalIdentifier[]
  title: Value
  subtitle?: Value
  translatedTitle?: TranslatedTitle
  workCategory?: Value
  workType: WorkType
  dateSortString?: MonthDayYearDate
  userSource?: boolean
  visibility?: Visibility
}
interface WorkType {
  errors?: any[]
  required?: boolean
  getRequiredMessage?: any
  value: WorkTypes
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
  visibilityError?: boolean
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
