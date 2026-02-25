export type RecordImportWizardMetadataType = 'Featured' | 'Default' | 'Certified'

export interface RecordImportWizardMetadata {
  type?: RecordImportWizardMetadataType
  index?: number
  defaultDescription?: string
  logoUrl?: string
}

export interface RecordImportWizard {
  actTypes?: string[]
  clientWebsite?: string
  description?: string
  geoAreas?: string[]
  id: string
  isConnected?: boolean
  name: string
  redirectUri: string
  redirectUriMetadata?: RecordImportWizardMetadata
  scopes: string
  status?: string
  show?: boolean
}

/**
 * Response shape from GET workspace/retrieve-works-search-and-link-wizard.json.
 * Uses "connected" (JSON) instead of "isConnected".
 */
export interface SearchAndLinkWizardFormSummaryResponse {
  id: string
  name: string
  description?: string
  redirectUri: string
  scopes: string
  redirectUriMetadata?: RecordImportWizardMetadata
  connected?: boolean
}
