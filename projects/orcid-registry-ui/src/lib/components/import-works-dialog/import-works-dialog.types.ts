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
 * All user-facing strings (title, introText, labels) should be passed in so the host app can supply translatable text.
 */
export interface ImportWorksDialogData {
  /** When true, shows shimmer skeleton placeholders for the link sections instead of content. */
  loading?: boolean
  /** Header/title of the dialog. */
  title: string
  /** Optional intro paragraph above the sections. */
  introText?: string
  /** Optional support link shown below intro. */
  supportLink?: { url: string; label: string }
  /** Section heading for certified services (e.g. "ORCID Certified Services"). */
  certifiedSectionHeading?: string
  /** Section heading for non-certified services (e.g. "More Services"). */
  moreServicesHeading?: string
  /** Button label for connecting to a service (e.g. "Connect now"). */
  connectNowLabel?: string
  /** Label shown when a certified service is already connected (e.g. "Connected"). */
  connectedLabel?: string
  /** Links shown under the certified section heading. */
  certifiedLinks: ImportWorksCertifiedLink[]
  /** Ordered list of links shown under the more services heading. */
  moreServicesLinks: ImportWorksMoreLink[]
}
