export type supportInterstitials =
  | 'domains-interstitial'
  | 'affiliation-interstitial'
  | 'backup-email-interstitial'

export interface BaseInterstitialDialogOutput {
  type: supportInterstitials
}

export interface BaseInterstitialDialogInput {
  type: supportInterstitials
}
