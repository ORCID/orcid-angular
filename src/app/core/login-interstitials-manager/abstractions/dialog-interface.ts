export type supportInterstitials =
  | 'domains-interstitial'
  | 'affiliation-interstitial'
  | 'backup-email-interstitial'
  | 'recovery-phone-interstitial'

export interface BaseInterstitialDialogOutput {
  type: supportInterstitials
}

export interface BaseInterstitialDialogInput {
  type: supportInterstitials
}

/**
 * The other three interstitials declare their output next to their own dialog
 * component. This one is declared here so the record page can read the result
 * without importing the dialog, which is being written separately.
 */
export interface RecoveryPhoneComponentDialogOutput
  extends BaseInterstitialDialogOutput {
  type: 'recovery-phone-interstitial'
  /** The masked number, never the full one. */
  addedRecoveryPhone?: string
}
