export interface ExpandedSearchResultsContent {
  'orcid-id': string
  'given-names': string
  'family-names': string
  creditName?: any
  'other-name': any[]
  email?: any
  'institution-name': any[]
}

export interface SearchResults {
  'expanded-result': ExpandedSearchResultsContent[]
  'num-found': number
}
