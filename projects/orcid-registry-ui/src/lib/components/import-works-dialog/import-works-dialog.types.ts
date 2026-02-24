/**
 * A certified import service (ORCID Certified Services section).
 * When `connected` is true, the UI shows a "Connected" state instead of "Connect now".
 */
export interface ImportWorksCertifiedLink {
  name: string
  description: string
  url: string
  connected: boolean
  /** Material icon name (e.g. "link"). Shown when imageUrl is not set. */
  icon?: string
  /** Image URL for the service logo. When set, shown instead of icon. */
  imageUrl?: string
}

/**
 * A non-certified import service (More Services section).
 */
export interface ImportWorksMoreLink {
  name: string
  description: string
  url: string
  /** Material icon name. Shown when imageUrl is not set. */
  icon?: string
  /** Image URL for the service logo. When set, shown instead of icon. */
  imageUrl?: string
}

/**
 * Data passed into the Import your works dialog via MAT_DIALOG_DATA.
 */
export interface ImportWorksDialogData {
  /** Header/title of the dialog. */
  title: string
  /** Optional intro paragraph above the sections. */
  introText?: string
  /** Optional support link shown below intro (e.g. "Find out more about importing works..."). */
  supportLink?: { url: string; label: string }
  /** Links shown under "ORCID Certified Services". */
  certifiedLinks: ImportWorksCertifiedLink[]
  /** Ordered list of links shown under "More Services". */
  moreServicesLinks: ImportWorksMoreLink[]
}
