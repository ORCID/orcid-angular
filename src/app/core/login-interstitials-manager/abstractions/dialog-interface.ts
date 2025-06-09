export type supportInterstitials =
  | 'domains-interstitial'
  | 'affiliation-interstitial'

export interface BaseInterstitialDialogOutput {
  type: supportInterstitials
}

export interface BaseInterstitialDialogInput {
  type: supportInterstitials
}
