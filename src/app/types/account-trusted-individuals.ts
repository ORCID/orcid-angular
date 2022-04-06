import { Value } from './common.endpoint'

interface OrcidElement {
  uri: string
  path: string
  host: string
}

export interface AccountTrustedIndividual {
  giverOrcid: OrcidElement
  giverName?: any
  receiverOrcid: OrcidElement
  receiverName: Value
  approvalDate: number
}

export interface PersonDetails {
  'last-modified-date': Value
  name: {
    'created-date': Value
    'last-modified-date': Value
    'given-names': Value
    'family-name': Value
    'credit-name'?: any
    source?: any
    visibility: string
    path: string
  }
  'other-names': {
    'last-modified-date'?: any
    'other-name': any[]
    path: string
  }
  biography?: any
  path: string
}
