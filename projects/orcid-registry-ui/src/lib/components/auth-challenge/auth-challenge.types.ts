import { Observable } from 'rxjs'

/**
 * The id of the challenge's own heading. A dialog host names the dialog with
 * `ariaLabelledBy: AUTH_CHALLENGE_HEADING_ID` rather than repeating the
 * heading as an `ariaLabel`: the panel already says what it is, and a second
 * copy of that sentence is a second string to translate.
 */
export const AUTH_CHALLENGE_HEADING_ID = 'auth-challenge-heading'

/**
 * What `verify()` answers with.
 *
 * The registry checks the password before it looks at the code, so a wrong
 * password comes back with no code attempt spent (R5.2). Collapsing that to a
 * boolean tells a user who typed the right code and the wrong password that
 * their code was wrong, which is both untrue and unhelpful.
 */
export type AuthChallengeRecoveryPhoneVerification =
  /** The code was accepted. From here 2FA is off for this account (R5.3). */
  | 'passed'
  /** The password was wrong; the code was never looked at, and still works. */
  | 'invalidPassword'
  /** The code was wrong, expired or spent - or nothing came back at all. */
  | 'invalidCode'

/**
 * Everything the challenge needs in order to offer a recovery phone number,
 * in one object supplied by whoever hosts it.
 *
 * The challenge lives in the component library: it cannot inject an
 * application service, reach for HttpClient or know what a Togglz flag is. So
 * the host resolves all of that and hands the result over as a single input.
 * The component only reads the state below and calls the methods; it never
 * decides whether the option is available, and never talks to the registry.
 *
 * The plain fields are read straight from the template, so whatever produces
 * this object has to mutate it in place rather than replace it.
 */
export interface AuthChallengeRecoveryPhone {
  /**
   * Whether to offer the option at all: the feature flag is on, 2FA is active
   * on the account and a number is stored (R5.1). Starts false and may turn
   * true once the host has resolved it, so the template must read it live.
   */
  available: boolean

  /** Only ever the last four digits; the registry never reads the number back. */
  maskedNumber?: string

  /** A code is outstanding, so the code field is worth showing. */
  codeSent: boolean

  /** Seconds left before the registry will accept another send. */
  resendSeconds: number

  /** A send is in flight. */
  sending: boolean

  /**
   * Why the last *send* failed, from the registry's error vocabulary, or `HTTP`
   * when it never answered. A rejected code is not reported here: `verify()`
   * names what was rejected and the component puts the error on the field.
   */
  errorCode?: string

  /**
   * True once a code has been accepted. From that moment 2FA is off for this
   * account, so the action the challenge was guarding can run on the password
   * alone and the host must not ask for a 2FA code again. Whoever learns first
   * sets it - the challenge when it is still listening, the object that made
   * the request when it is not - so a host may read it after the challenge has
   * closed, which is when hosts read it.
   */
  used: boolean

  /** Sends a code to the stored number. Drives `sending`, `codeSent`, `resendSeconds`. */
  sendCode(): void

  /**
   * Answers what the registry made of the password and the code.
   *
   * A pass has already happened on the server by the time this emits: 2FA is
   * off, the number is gone and the backup codes are void. Hanging up undoes
   * none of it, so an implementation must carry out its own consequences on
   * the response itself and not from this subscription - the challenge may
   * have closed while the request was in flight (R5.4).
   */
  verify(
    password: string,
    code: string
  ): Observable<AuthChallengeRecoveryPhoneVerification>

  /**
   * Stops whatever this handle is still running - a resend countdown, above
   * all - and is called by the challenge when it closes, because a countdown
   * belongs to the challenge that started it. The fields stay readable
   * afterwards: hosts ask `used` once the challenge is gone.
   */
  dispose(): void
}
