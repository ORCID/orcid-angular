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
