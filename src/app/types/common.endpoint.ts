export interface LastModifiedDate {
  value: number
}

export interface CreatedDate {
  value: number
}

export interface Biography {
  lastModifiedDate: LastModifiedDate
  createdDate: CreatedDate
  content: string
  visibility: string
  path?: any
}

export interface SourceName {
  content: string
}

export interface Source {
  sourceOrcid?: SourceOrcid
  sourceClientId?: any
  sourceName: SourceName
}

export interface OtherName {
  content: string
  source: Source
  putCode: number
  lastModifiedDate: LastModifiedDate
  createdDate: CreatedDate
  visibility: string
  path?: any
  displayIndex: number
}

export interface Country {
  [x: string]: any // TODO: DEFINE
}

export interface Address {
  country: Country
  source: Source
  putCode: number
  lastModifiedDate: LastModifiedDate
  createdDate: CreatedDate
  visibility: string
  path?: any
  displayIndex: number
}

export interface Url {
  value: string
}

export interface ResearcherUrl {
  urlName: string
  url: Url
  source: Source
  putCode: number
  lastModifiedDate: LastModifiedDate
  createdDate: CreatedDate
  visibility: string
  path?: any
  displayIndex: number
}

export interface SourceOrcid {
  uri: string
  path: string
  host: string
}

export interface SourceName {
  content: string
}

export interface Email {
  email: string
  source: Source
  lastModifiedDate: LastModifiedDate
  createdDate: CreatedDate
  putCode?: any
  path?: any
  visibility: string
  verified: boolean
  primary: boolean
}

export interface MonthDayYearDate {
  errors: [any] // populate with data
  month: string
  day: string
  year: string
  required: boolean
  getRequiredMessage: any
}
