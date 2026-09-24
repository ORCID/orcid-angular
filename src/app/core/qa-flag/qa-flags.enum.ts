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
}
