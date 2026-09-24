import { Injectable, Injector, OnDestroy, ProviderToken } from '@angular/core'
import {
  AuthChallengeRecoveryPhone,
  AuthChallengeRecoveryPhoneVerification,
} from '@orcid/registry-ui'
import {
  Observable,
  ReplaySubject,
  Subscription,
  combineLatest,
  interval,
  of,
} from 'rxjs'
import { catchError, first, take } from 'rxjs/operators'

import { AppEventName } from '../../rum/app-event-names'
import { RumJourneyEventService } from '../../rum/service/customEvent.service'
import { AuthChallenge } from '../../types/common.endpoint'
import { TogglzFlag } from '../../types/config.endpoint'
import { Status } from '../../types/two-factor.endpoint'
import { TogglzService } from '../togglz/togglz.service'
import { UserService } from '../user/user.service'
import { RecoveryPhoneNoticeService } from './recovery-phone-notice.service'
import { TwoFactorAuthenticationService } from './two-factor-authentication.service'

/**
 * Builds the object the "Verify your ORCID account" challenge is handed when it
 * is allowed to offer a recovery phone number (R5.1 to R5.4).
 *
 * The challenge lives in the component library, so it can neither reach the
 * registry nor read a feature flag. Everything it needs is resolved here and
 * handed over as one plain object that it reads and calls.
 *
 * A host creates one per challenge it opens:
 *
 *   const recoveryPhone = this._recoveryPhoneChallenge.create()
 *   this._dialog.open(AuthChallengeComponent, { data: { ..., recoveryPhone } })
 *
 * and, once the challenge closes, asks `recoveryPhone.used` whether 2FA was
 * turned off on the way through. The challenge disposes of the handle when it
 * closes, which stops whatever that one challenge had running.
 */
@Injectable({
  providedIn: 'root',
})
export class RecoveryPhoneChallengeService implements OnDestroy {
  /** Every subscription any handle has opened, so none outlive the app. */
  private readonly subscriptions = new Subscription()

  constructor(
    private _twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private _togglz: TogglzService,
    private _injector: Injector
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  create(options?: { onUsed?: () => void }): AuthChallengeRecoveryPhone {
    /**
     * Everything this one challenge is running, above all the resend
     * countdown. `dispose()` empties it, so a countdown ends with the
     * challenge that started it rather than with the application. It still
     * hangs off the service's own bag, so a host that never disposes is a
     * tidiness problem and not a leak that survives the injector.
     */
    const running = new Subscription()
    this.subscriptions.add(running)

    /**
     * Read when the challenge opens, not when a code is accepted: by then the
     * account is about to lose its 2FA and the page is about to change, and
     * the notice waiting on the record is keyed by the iD it belongs to. Kept
     * out of `running` because the verify that reads it must survive disposal.
     */
    let orcid = ''
    const user = this.optional(UserService)
    if (user) {
      this.subscriptions.add(
        user
          .getUserSession()
          .pipe(first())
          .subscribe((session) => {
            orcid = session?.userInfo?.EFFECTIVE_USER_ORCID || ''
          })
      )
    }

    const handle: AuthChallengeRecoveryPhone = {
      available: false,
      maskedNumber: undefined,
      codeSent: false,
      resendSeconds: 0,
      sending: false,
      errorCode: undefined,
      used: false,
      sendCode: () => this.sendCode(handle, running),
      verify: (password: string, code: string) =>
        this.verify(handle, password, code, () => orcid, options?.onUsed),
      dispose: () => running.unsubscribe(),
    }

    this.resolveAvailability(handle, running)

    return handle
  }

  /**
   * The option is offered only when all three hold: the feature is on, 2FA is
   * active on the account, and there is a number to send a code to (R5.1).
   * Anything the registry cannot answer leaves it unavailable, which is the
   * safe direction - the challenge then looks exactly as it always has.
   */
  private resolveAvailability(
    handle: AuthChallengeRecoveryPhone,
    running: Subscription
  ): void {
    running.add(
      combineLatest([
        this._togglz.getStateOf(TogglzFlag.TWO_FACTOR_RECOVERY_PHONE),
        this._twoFactorAuthenticationService
          .checkState()
          .pipe(catchError(() => of(undefined as Status | undefined))),
      ])
        .pipe(first())
        .subscribe(([flagEnabled, status]) => {
          handle.maskedNumber = status?.maskedRecoveryPhoneNumber
          handle.available =
            !!flagEnabled &&
            !!status?.enabled &&
            !!status?.maskedRecoveryPhoneNumber
        })
    )
  }

  private sendCode(
    handle: AuthChallengeRecoveryPhone,
    running: Subscription
  ): void {
    if (handle.sending || handle.resendSeconds > 0) {
      return
    }
    handle.sending = true
    handle.errorCode = undefined

    running.add(
      this._twoFactorAuthenticationService
        .sendRecoveryPhoneChallengeCode()
        .pipe(first())
        .subscribe({
          next: (response) => {
            handle.sending = false
            if (response?.maskedRecoveryPhoneNumber) {
              handle.maskedNumber = response.maskedRecoveryPhoneNumber
            }
            if (response?.success) {
              handle.codeSent = true
              this.startCountdown(handle, running, response.resendAfterSeconds)
              return
            }
            if (response?.errorCode === 'RESEND_TOO_SOON') {
              // A code is already out there; the only news is how long the
              // registry wants us to wait before it will send another.
              handle.codeSent = true
              this.startCountdown(handle, running, response.resendAfterSeconds)
              return
            }
            handle.errorCode = response?.errorCode ?? 'SMS_SEND_FAILED'
          },
          error: () => {
            handle.sending = false
            handle.errorCode = 'HTTP'
          },
        })
    )
  }

  /**
   * Counts the registry's own resend buffer down, so the resend control comes
   * back at the moment another send would be accepted. It ends three ways:
   * `take` bounds it, `dispose()` ends it with the challenge, and the service
   * bag ends it with the application.
   */
  private startCountdown(
    handle: AuthChallengeRecoveryPhone,
    running: Subscription,
    seconds: number
  ): void {
    const wait = Math.max(0, Math.floor(seconds || 0))
    handle.resendSeconds = wait
    if (wait === 0) {
      return
    }
    running.add(
      interval(1000)
        .pipe(take(wait))
        .subscribe({
          next: () => {
            handle.resendSeconds = Math.max(0, handle.resendSeconds - 1)
          },
          complete: () => {
            handle.resendSeconds = 0
          },
        })
    )
  }

  /**
   * A success here is not only an authentication: the registry has just
   * disabled 2FA, deleted the number and invalidated the backup codes in one
   * transaction. The record has to say so the next time it is opened (R5.4),
   * and the host has to know not to ask for a 2FA code again.
   *
   * So the request is subscribed here, once, and everything that follows from
   * it happens on the response. The challenge is handed a subject it may leave
   * at any time - if the user cancels or the dialog closes mid-flight, the
   * server has still done all of the above, and the notice, the telemetry and
   * `used` still have to be right.
   *
   * The registry checks the password before the code, so a rejection says
   * which of the two it was (R5.2); a request that never landed says nothing,
   * and a code that has not been proven wrong is the safer thing to blame.
   */
  private verify(
    handle: AuthChallengeRecoveryPhone,
    password: string,
    code: string,
    readOrcid: () => string,
    onUsed?: () => void
  ): Observable<AuthChallengeRecoveryPhoneVerification> {
    const answer = new ReplaySubject<AuthChallengeRecoveryPhoneVerification>(1)

    this.subscriptions.add(
      this._twoFactorAuthenticationService
        .verifyRecoveryPhoneChallengeCode({
          password,
          verificationCode: code,
        })
        .pipe(first())
        .subscribe({
          next: (response: AuthChallenge) => {
            if (!response?.success) {
              answer.next(
                response?.invalidPassword ? 'invalidPassword' : 'invalidCode'
              )
              answer.complete()
              return
            }

            handle.used = true
            this.optional(RecoveryPhoneNoticeService)?.markTwoFactorDisabled(
              readOrcid()
            )
            // No attributes: a phone number, an ORCID iD and an email address are
            // all out of bounds here, and nothing else about this is interesting.
            this.optional(RumJourneyEventService)?.recordSimpleEvent(
              AppEventName.AuthChallengeRecoveryPhoneUsed
            )
            onUsed?.()

            answer.next('passed')
            answer.complete()
          },
          error: () => {
            answer.next('invalidCode')
            answer.complete()
          },
        })
    )

    return answer.asObservable()
  }

  /**
   * The session, the record notice and the telemetry are looked up where they
   * are used rather than taken in the constructor. None of them is what this
   * service is for: they are courtesies around the one thing that matters,
   * which is whether the code was accepted. A challenge that cannot be opened
   * because a page action could not be recorded would be the wrong trade, and
   * it would also drag the whole session graph into every host that opens one.
   */
  private optional<T>(token: ProviderToken<T>): T | null {
    try {
      return this._injector.get(token, null)
    } catch {
      return null
    }
  }
}
