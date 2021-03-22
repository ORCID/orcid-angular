import { AssertionBase, GroupBase } from './record.endpoint'
import { ExternalIdentifier } from './common.endpoint'

export interface Host {
  city: string
  country: string
  disambiguationSource: string
  name: string
  orgDisambiguatedId: string
  region: string
}

export interface ResearchResource extends AssertionBase {
  endDate: any
  externalIdentifiers: ExternalIdentifier[]
  hosts: Host[]
  items: any
  lastModifiedDate: any
  path: any
  startDate
  title: string
  translatedTitle: string
  translatedTitleLanguageCode: string
  showDetails: boolean
}

export interface ResearchResourcesGroup extends GroupBase {
  defaultResearchResource: ResearchResource[]
  researchResources: ResearchResource[]
}

export interface ResearchResources {
  groups: ResearchResourcesGroup[]
  nextOffset: number
  totalGroups: number
}
