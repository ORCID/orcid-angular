import { Value, SourceOrcid } from './common.endpoint'

export interface Delegator {
  giverOrcid: SourceOrcid
  giverName: Value
  receiverOrcid: SourceOrcid
  receiverName?: any // TODO is this always empty?
  approvalDate: number
}

export interface TrustedIndividuals {
  delegators: Delegator[]
  me?: Delegator
}
