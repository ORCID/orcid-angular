import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map, switchMap, first, take } from 'rxjs/operators'

import { getOrcidNumber, isValidOrcidFormat } from '../../constants'
import { Claim } from '../../types/claim.endpoint'
import { Reactivation } from '../../types/reactivation.endpoint'
import {
  RecoveryPhoneSignInSendResponse,
  RecoveryPhoneSignInVerifyResponse,
  SignIn,
} from '../../types/sign-in.endpoint'
import { SignInLocal, TypeSignIn } from '../../types/sign-in.local'
import { CustomEncoder } from '../custom-encoder/custom.encoder'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { UserService } from '../user/user.service'
import { ERROR_REPORT } from 'src/app/errors'
import { Title } from '@angular/platform-browser'

import { CookieService } from 'ngx-cookie-service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'
import { RumJourneyEventService } from 'src/app/rum/service/customEvent.service'
import { AppEventName } from 'src/app/rum/app-event-names'
import { retryTransient } from '../http/retry-transient'

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  constructor(
    private _http: HttpClient,
    private _titleService: Title,
    private _errorHandler: ErrorHandlerService,
    private _cookie: CookieService,
    private _togglz: TogglzService,
    private _userService: UserService,
    private _observability: RumJourneyEventService
  ) {}

  /**
   * @param  SignInLocal sign in information
   * @param  updateUserSession default true, set to true if after successfully signing Orcid Angular will still be open
   * @param  forceSessionUpdate default false, set to true if the user session should be updated even when the user status does not change
   */
  signIn(
    signInLocal: SignInLocal,
    updateUserSession = true,
    forceSessionUpdate = false
  ) {
    return this._togglz.getStateOf(TogglzFlag.OAUTH_SIGNIN).pipe(
      take(1),
      switchMap((outhSiginFlag) => {
        let usingOauthServer = false
        let orcidLoginUrl = ''
        if (outhSiginFlag === true) {
          orcidLoginUrl = runtimeEnvironment.AUTH_SERVER + 'login'
          usingOauthServer = true
        } else {
          orcidLoginUrl = runtimeEnvironment.API_WEB + 'signin/auth.json'
          usingOauthServer = false
        }

        let loginUrl = orcidLoginUrl
        let isSocialSignIn = false

        if (signInLocal.type && signInLocal.type === TypeSignIn.institutional) {
          loginUrl = runtimeEnvironment.API_WEB + 'shibboleth/signin/auth.json'
          isSocialSignIn = true
        }

        if (signInLocal.type && signInLocal.type === TypeSignIn.social) {
          loginUrl = runtimeEnvironment.API_WEB + 'social/signin/auth.json'
          isSocialSignIn = true
        }

        let headers = new HttpHeaders()
        if (usingOauthServer === true && isSocialSignIn === false) {
          headers = headers.set(
            'Access-Control-Allow-Origin',
            runtimeEnvironment.AUTH_SERVER
          )
          headers = headers.set(
            'Content-Type',
            'application/x-www-form-urlencoded'
          )
          let csrf = this._cookie.get('AUTH-XSRF-TOKEN')
          headers = headers.set('x-xsrf-token', csrf)
          //TODO: This is temporarly, until we permanently move the authorization to the auth server
          headers = headers.set('orcid-original-request', window.location.href)
        }

        let body = new HttpParams({ encoder: new CustomEncoder() })
          .set('username', getOrcidNumber(signInLocal.data.username))
          .set('password', signInLocal.data.password)
        if (signInLocal.data.verificationCode) {
          body = body.set('verificationCode', signInLocal.data.verificationCode)
        }
        if (signInLocal.data.recoveryCode) {
          body = body.set('recoveryCode', signInLocal.data.recoveryCode)
        }
        body = body.set('oauthRequest', signInLocal.isOauth ? 'true' : 'false')
        return this._http
          .post<SignIn>(loginUrl, body, {
            headers: headers,
            withCredentials: true,
          })
          .pipe(
            retryTransient(),
            catchError((error) => {
              this.recordSignInHttpError(error, signInLocal, usingOauthServer)
              return this._errorHandler.handleError(error)
            }),
            switchMap((response) => {
              if (!updateUserSession) {
                return of(response)
              }
              // call refreshUserSession with force session update to handle register actions from sessions with a logged in user
              return this._userService
                .refreshUserSession(forceSessionUpdate, true)
                .pipe(
                  first(),
                  map(() => response)
                )
            })
          )
      })
    )
  }

  /**
   * Texts a verification code to the recovery phone number stored on the
   * account, after the registry has checked the password itself (R3.2).
   *
   * This and {@link verifyRecoveryPhoneCode} always talk to the Registry
   * (`API_WEB`), whichever way OAUTH_SIGNIN is set and whichever screen the
   * user is on: only the Registry holds `profile_recovery_phone`, so the auth
   * server has no number to send a code to and nothing to verify one against.
   * The ordinary sign-in below is the only call that moves between the two.
   *
   * Posted as JSON rather than form-encoded because these are new endpoints,
   * unbound by the form post the legacy sign-in has always used.
   */
  sendRecoveryPhoneCode(request: {
    username: string
    password: string
  }): Observable<RecoveryPhoneSignInSendResponse> {
    return this._http
      .post<RecoveryPhoneSignInSendResponse>(
        runtimeEnvironment.API_WEB + 'signin/recoveryPhone/sendCode.json',
        {
          // Same normalisation the sign-in post applies, so an iD typed with
          // or without the https://orcid.org/ prefix reaches the same account
          username: getOrcidNumber(request.username),
          password: request.password,
        },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          withCredentials: true,
        }
      )
      .pipe(
        retryTransient(),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  /**
   * Posts the texted code. On success the registry has already disabled 2FA,
   * deleted the number and invalidated the unused backup codes in one
   * transaction (R3.5); the caller then submits the ordinary sign-in with no
   * code at all, which now succeeds.
   *
   * Goes to the Registry for the reason given on {@link sendRecoveryPhoneCode}.
   */
  verifyRecoveryPhoneCode(request: {
    username: string
    password: string
    verificationCode: string
  }): Observable<RecoveryPhoneSignInVerifyResponse> {
    return this._http
      .post<RecoveryPhoneSignInVerifyResponse>(
        runtimeEnvironment.API_WEB + 'signin/recoveryPhone/verify.json',
        {
          username: getOrcidNumber(request.username),
          password: request.password,
          verificationCode: request.verificationCode,
        },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          withCredentials: true,
        }
      )
      .pipe(
        retryTransient(),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  /**
   * Reports sign-in HTTP/network failures with flow context for NR dashboards.
   * Application-level failures (200 + success: false) use {@link AppEventName.SignInFailure}.
   */
  private recordSignInHttpError(
    error: unknown,
    signInLocal: SignInLocal,
    usingOauthServer: boolean
  ): void {
    const attrs: Record<string, unknown> = {
      sign_in_flow: this.getSignInFlowLabel(signInLocal, usingOauthServer),
      oauth_context: !!signInLocal.isOauth,
    }
    if (error instanceof HttpErrorResponse) {
      attrs.status = error.status
      attrs.statusText = error.statusText
      attrs.url_path_and_query = this.urlPathAndQueryForReport(error.url)
    } else {
      attrs.error_kind = 'non_http'
    }
    this._observability.recordSimpleEvent(AppEventName.SignInHttpError, attrs)
  }

  private getSignInFlowLabel(
    signInLocal: SignInLocal,
    usingOauthServer: boolean
  ): string {
    if (signInLocal.type === TypeSignIn.institutional) {
      return 'institutional'
    }
    if (signInLocal.type === TypeSignIn.social) {
      return 'social'
    }
    return usingOauthServer ? 'password_oauth_server' : 'password_legacy'
  }

  /** Path + query for failed request URL (query helps debug OAuth/sign-in issues). */
  private urlPathAndQueryForReport(
    url: string | null | undefined
  ): string | undefined {
    if (!url) {
      return undefined
    }
    try {
      const u = new URL(url)
      return u.pathname + u.search
    } catch {
      return url
    }
  }

  reactivation(username: string) {
    let body = new HttpParams({ encoder: new CustomEncoder() })
    body = body.set(isValidOrcidFormat(username) ? 'orcid' : 'email', username)
    return this._http
      .post<Reactivation>(
        runtimeEnvironment.API_WEB + `sendReactivation.json`,
        body,
        {
          withCredentials: true,
        }
      )
      .pipe(
        retryTransient(),
        catchError((error) =>
          this._errorHandler.handleError(
            error,
            ERROR_REPORT.REGISTER_REACTIVATED_EMAIL
          )
        )
      )
  }

  resendClaim(username: string) {
    let claim: Claim = {
      email: username,
      errors: [],
      successMessage: null,
    }
    let body = JSON.stringify(claim)

    return this._http
      .post<Claim>(runtimeEnvironment.API_WEB + `resend-claim.json`, body, {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }),
        withCredentials: true,
      })
      .pipe(
        retryTransient(),
        catchError((error) =>
          this._errorHandler.handleError(
            error,
            ERROR_REPORT.REGISTER_REACTIVATED_EMAIL
          )
        )
      )
  }

  singOut() {
    this._titleService.setTitle('ORCID')
    return this._http
      .get<SignIn>(
        runtimeEnvironment.API_WEB + 'userStatus.json?logUserOut=true',
        {
          withCredentials: true,
        }
      )
      .pipe(
        retryTransient(),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap(() => this._userService.refreshUserSession())
      )
  }
}
