export interface RecordCorrection {
  sequence: number
  sqlUsedToUpdate: string
  description: string
  numChanged: number
  type: string
  dateCreated: number
  lastModified: number
}

// The backend answers a page beyond the first or last one with HTTP 200 and an
// empty page object, so every field can come back null.
export interface RecordCorrectionsPage {
  haveNext: boolean | null
  havePrevious: boolean | null
  firstElementId: number | null
  lastElementId: number | null
  recordCorrections: RecordCorrection[] | null
}
