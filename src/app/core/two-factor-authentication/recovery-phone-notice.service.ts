import { Inject, Injectable } from '@angular/core'

import { WINDOW } from '../../cdk/window'

/**
 * Carries one fact across a full page navigation: that the user has just signed
 * in with their recovery phone number, which disabled 2FA and deleted the
 * number (R3.5). The sign-in page learns it; the record page shows the notice.
 *
 * A field on a service cannot survive that navigation - the sign-in flow
 * submits an ordinary form post and the whole application is reloaded - so the
 * fact is parked in localStorage under the ORCID iD it belongs to, and read
 * back exactly once so a reload does not show the notice again (R3.6).
 *
 * Every access is guarded: localStorage throws in a private window, and a
 * notice that cannot be shown must never break the record page.
 */
@Injectable({
  providedIn: 'root',
})
export class RecoveryPhoneNoticeService {
  constructor(@Inject(WINDOW) private window: Window) {}

  markTwoFactorDisabled(orcid: string): void {
    if (!orcid) {
      return
    }
    try {
      this.window.localStorage.setItem(this.storageKey(orcid), 'true')
    } catch {
      // Nothing to fall back on: the notice is a courtesy, not the outcome
    }
  }

  /** Reads the flag and clears it, so the notice is shown exactly once. */
  consumeTwoFactorDisabled(orcid: string): boolean {
    if (!orcid) {
      return false
    }
    try {
      const key = this.storageKey(orcid)
      const value = this.window.localStorage.getItem(key)
      this.window.localStorage.removeItem(key)
      return value === 'true'
    } catch {
      return false
    }
  }

  private storageKey(orcid: string): string {
    return `${orcid}_2FA_DISABLED_BY_RECOVERY_PHONE`
  }
}
