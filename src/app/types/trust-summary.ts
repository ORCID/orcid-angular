import { AffiliationType } from './record-affiliation.endpoint'

export interface TrustedSummary {
  name: string
  orcid: string
  employmentAffiliations: ActivitySummary[]
  employmentAffiliationsCount: number
  educationQualifications: ActivitySummary[]
  educationQualificationsCount: number
  validatedResearchResources: number
  selfAssertedResearchResources: number
  creation: string
  lastModified: string
  validatedWorks: number
  selfAssertedWorks: number
  peerReviewsTotal: number
  peerReviewPublicationGrants: number
  validatedFunds: number
  selfAssertedFunds: number
  professionalActivities: ActivitySummary[]
  professionalActivitiesCount: number
  externalIdentifiers: ExternalIdentifierSummary[]
  emailDomainsCount: number
  emailDomains: EmailDomains[]
  status: 'locked' | 'deprecated' | 'deactivated' | 'active'
}

export interface ActivitySummary {
  organizationName?: string
  url?: string
  startDate?: string
  endDate?: string
  role?: string
  title: any
  type: AffiliationType
  validated: boolean
}

export interface EmailDomains {
  value: string
}

export interface ExternalIdentifierSummary {
  id: string
  commonName: string
  reference: string
  url: string
  validated: boolean
}
