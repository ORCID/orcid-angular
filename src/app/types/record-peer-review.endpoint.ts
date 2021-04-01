import { AssertionBase } from './record.endpoint'
import { ExternalIdentifier, MonthDayYearDate, Value } from './common.endpoint'

export interface PeerReview extends AssertionBase {
  city: Value
  completionDate: MonthDayYearDate
  country: Value
  countryForDisplay: string
  externalIdentifiers: ExternalIdentifier[]
  description: string
  groupId?: number
  groupIdPutCode?: any
  groupIdValue?: any
  groupType?: any
  orgName: Value
  role: Value
  subjectContainerName: any
  subjectExternalIdentifier: string
  subjectName: any
  subjectType: any
  subjectUrl: string
  translatedSubjectName: string
  type: Value | string
  name: string
  peerReviewDuplicateGroups: PeerReviewDuplicateGroup[]
  showDetails: boolean
}

export interface PeerReviewDuplicateGroup {
  activatePutCode: number
  id: number
  peerReviews: PeerReview[]
}
