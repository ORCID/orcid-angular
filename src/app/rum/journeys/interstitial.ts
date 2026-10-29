/**
 * Journey for the sign-in interstitials (backup email, email domains,
 * affiliation). One journey per interstitial shown; differentiate by
 * `interstitialName` in context.
 *
 * Attribute keys must avoid the words orcid/email/pid/delegator — the RUM
 * sanitizer in `service/customEvent.service.ts` redacts any key matching them,
 * which would make the attribute useless for faceting. Never carry an address.
 */
export interface InterstitialContext {
  /** InterstitialType, e.g. `BACKUP_EMAIL_INTERSTITIAL`. */
  interstitialName: string
}

export interface InterstitialEventAttributes {
  /** Which inline error blocked the submit: `required` | `invalid` | `in_use`. */
  validationErrorKind?: string
  /** Whether the form was valid at the time of the event. */
  formValid?: boolean
}
