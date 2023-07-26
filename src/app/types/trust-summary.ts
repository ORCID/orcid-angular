export interface TrustedSummary {
  name: string
  orcid: string
  employmentAffiliations: ActivitySummary[]
  employmentAffiliationsCount: number
  creation: string
  lastModified: string
  validatedWorks: number
  selfAssertedWorks: number
  reviews: number
  peerReviewPublicationGrants: number
  validatedFunds: number
  selfAssertedFunds: number
  professionalActivities: ActivitySummary[]
  professionalActivitiesCount: number
  externalIdentifiers: any[]
}

export interface ActivitySummary {
  organizationName?: string
  url?: string
  startDate?: string
  endDate?: string
  role?: string
  title: any
  type: string
  validatedOrSelfAsserted: boolean
}
