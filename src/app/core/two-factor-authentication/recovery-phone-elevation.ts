import { defer, Observable, timer } from 'rxjs'
import { map } from 'rxjs/operators'

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
    timer(
      Math.max(0, grantedAt + RECOVERY_PHONE_ELEVATION_TTL_MILLIS - Date.now())
    )
  ).pipe(map(() => undefined))
}
