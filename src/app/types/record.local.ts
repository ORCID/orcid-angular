import { Preferences, PersonIdentifierEndpoint, UserInfo } from '.'
import { OtherNamesEndPoint } from './record-other-names.endpoint'
import { KeywordEndPoint } from './record-keyword.endpoint'
import { NamesEndPoint } from './record-name.endpoint'
import { BiographyEndPoint } from './record-biography.endpoint'
import { CountriesEndpoint } from './record-country.endpoint'
import { EmailsEndpoint } from './record-email.endpoint'
import { WebsitesEndPoint } from './record-websites.endpoint'
import { AffiliationUIGroup } from './record-affiliation.endpoint'
import { FundingGroup } from './record-funding.endpoint'
import { PeerReview } from './record-peer-review.endpoint'
import { ResearchResourcesEndpoint } from './record-research-resources.endpoint'
import { WorksEndpoint } from './record-works.endpoint'

export interface SideBarPublicUserRecord {
  title?: any
  displayName?: any
  names?: any
  biography: BiographyEndPoint
  otherNames: OtherNamesEndPoint
  countries: CountriesEndpoint
  keyword: KeywordEndPoint
  emails: EmailsEndpoint
  externalIdentifier: PersonIdentifierEndpoint
  website: WebsitesEndPoint
  lastModifiedTime: any
}

export interface UserRecord {
  // person: Person
  emails: EmailsEndpoint
  otherNames: OtherNamesEndPoint
  countries: CountriesEndpoint
  keyword: KeywordEndPoint
  website: WebsitesEndPoint
  externalIdentifier: PersonIdentifierEndpoint
  names: NamesEndPoint
  biography: BiographyEndPoint
  preferences: Preferences
  affiliations: AffiliationUIGroup[]
  fundings: FundingGroup[]
  peerReviews: PeerReview[]
  researchResources: ResearchResourcesEndpoint
  works: WorksEndpoint
  lastModifiedTime: any
  userInfo: UserInfo
}

export interface UserRecordOptions {
  forceReload?: boolean
  publicRecordId?: string
  privateRecordId?: string
  sortAsc?: boolean
  sort?: boolean
  offset?: number
  pageSize?: number
}
