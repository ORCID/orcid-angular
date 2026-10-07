export enum QaFlag {
  forceDomainInterstitialAsNeverSeem = 'forceDomainInterstitialAsNeverSeem',
  forceInterstitialCheckOnEveryReload = 'forceInterstitialChecksOnEveryReload',
  forceAffiliationInterstitialNotSeem = 'forceAffiliationInterstitialAsNeverSeem',
  forceBackupEmailInterstitialNotSeem = 'forceBackupEmailInterstitialAsNeverSeem',
  forceRecoveryPhoneInterstitialNotSeem = 'forceRecoveryPhoneInterstitialAsNeverSeem',
  /**
   * Shortens the client's recovery phone elevation timer, in milliseconds.
   * Unlike the others this one carries a number rather than 'true', so it is
   * read where it is used rather than through QaFlagsService.
   */
  recoveryPhoneElevationTtlMillis = 'recoveryPhoneElevationTtlMillis',
  /**
   * Loads CookieYes instead of OneTrust in this browser (OPS-2428). Read by
   * scripts/onetrust.runtime.js before bootstrap, so it applies on the next
   * page load, and only on a QA or development host whose environment carries
   * a COOKIE_YES key.
   */
  useCookieYesConsent = 'useCookieYesConsent',
}
