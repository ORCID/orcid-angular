import { defer, Observable, timer } from 'rxjs'
import { map } from 'rxjs/operators'

import { QaFlag } from '../qa-flag/qa-flags.enum'

/**
 * How long adding or changing a recovery phone number stays open after the
 * proof of identity that allowed it (PD-13638).
 *
 * This mirrors `RECOVERY_PHONE_ELEVATION_TTL_MILLIS` in the registry's
 * `TwoFactorAuthenticationController`. There is no runtime coupling between
 * the two, and there does not need to be: the server is the authority, and it
 * refuses a request whose elevation has gone whatever this file believes. What
 * this constant decides is only when the client stops waiting to be told.
 *
 * If the two ever disagree the result is bounded either way. A client that is
 * shorter leaves a surface the user could still have used; a client that is
 * longer leaves them on a form whose next request is refused, and the surface
 * exits then instead. Neither widens what anyone may do.
 */
export const RECOVERY_PHONE_ELEVATION_TTL_MILLIS = 8 * 60 * 1000

/**
 * Fires once when the elevation granted at `grantedAt` runs out, and never
 * again. A grant already older than the window fires immediately.
 *
 * `grantedAt` is epoch milliseconds, and it is the moment the *elevation* was
 * granted rather than the moment a form was opened: the challenge passing, or
 * 2FA being turned on. A form opened five minutes into the window has three
 * minutes left, not eight.
 *
 * Deferred so the remaining time is measured when something subscribes, not
 * when the observable is built. The two are usually the same instant, and
 * where they are not it is the subscription that matters.
 */
export function recoveryPhoneElevationExpiry(
  grantedAt: number
): Observable<void> {
  return defer(() =>
    timer(Math.max(0, grantedAt + elevationTtlMillis() - Date.now()))
  ).pipe(map(() => undefined))
}

/**
 * The window, unless a test has asked for a shorter one.
 *
 * An end-to-end test cannot wait eight minutes for each of three surfaces, and
 * the alternative - freezing the browser clock - stops every other timer the
 * application owns. This reads the same kind of local flag the interstitial
 * tests already use (`QaFlag`), so the suite can prove the client half of the
 * exit against a real registry rather than a stubbed answer.
 *
 * It can only make a user's own window shorter. The registry enforces its own
 * eight minutes regardless, so nothing here widens what anybody may do; the
 * worst a value can achieve is to close a form that was still working.
 *
 * Local storage is unreadable in some privacy modes and throws rather than
 * returning null, hence the catch. Anything that is not a positive whole
 * number of milliseconds is ignored.
 */
function elevationTtlMillis(): number {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(QaFlag.recoveryPhoneElevationTtlMillis)
  } catch {
    return RECOVERY_PHONE_ELEVATION_TTL_MILLIS
  }
  if (!raw) {
    return RECOVERY_PHONE_ELEVATION_TTL_MILLIS
  }
  const asked = Number(raw)
  if (!Number.isInteger(asked) || asked <= 0) {
    return RECOVERY_PHONE_ELEVATION_TTL_MILLIS
  }
  return Math.min(asked, RECOVERY_PHONE_ELEVATION_TTL_MILLIS)
}
