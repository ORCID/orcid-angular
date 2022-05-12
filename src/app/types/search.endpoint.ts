export interface ExpandedSearchResultsContent {
  'orcid-id': string
  'given-names': string
  'family-names': string
  creditName?: any
  'other-name': any[]
  email?: string[]
  'institution-name': any[]
  alreadyOnRecord?: boolean
}

export interface SearchResults {
  'expanded-result': ExpandedSearchResultsContent[] | null
  'num-found': number
}

export interface SearchResultsByEmailOrOrcid {
  found: boolean
  isSelf: boolean
  isAlreadyAdded: boolean
}
