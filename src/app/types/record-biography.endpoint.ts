import { CreatedDate, LastModifiedDate, Value, Visibility } from './common.endpoint'

export interface Biography {
  lastModifiedDate: LastModifiedDate
  createdDate: CreatedDate
  content: string
  visibility: string
  path?: any
}

export interface BiographyEndPoint {
  visibility: Visibility
  biography: Value
  errors: string[]
}
