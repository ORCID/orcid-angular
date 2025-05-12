import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map, retry, switchMap, first, take } from 'rxjs/operators'

import { getOrcidNumber, isValidOrcidFormat } from '../../constants'
import { Claim } from '../../types/claim.endpoint'
import { Reactivation } from '../../types/reactivation.endpoint'
import { SignIn } from '../../types/sign-in.endpoint'
import { SignInLocal, TypeSignIn } from '../../types/sign-in.local'
import { CustomEncoder } from '../custom-encoder/custom.encoder'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { UserService } from '../user/user.service'
import { ERROR_REPORT } from 'src/app/errors'
import { Title } from '@angular/platform-browser'

import { CookieService } from 'ngx-cookie-service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'

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
    private _userService: UserService
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
    return this._togglz.getStateOf('OAUTH_SIGNIN').pipe(
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

          if (
            signInLocal.type &&
            signInLocal.type === TypeSignIn.institutional
          ) {
            orcidLoginUrl =
              runtimeEnvironment.API_WEB + 'shibboleth/signin/auth.json'
          }

          if (signInLocal.type && signInLocal.type === TypeSignIn.social) {
            orcidLoginUrl =
              runtimeEnvironment.API_WEB + 'social/signin/auth.json'
          }
        }

        let loginUrl = orcidLoginUrl

        let headers = new HttpHeaders()
        if (usingOauthServer === true) {
          let csrf = this._cookie.get('AUTH-XSRF-TOKEN')
          headers = headers.set(
            'Access-Control-Allow-Origin',
            runtimeEnvironment.AUTH_SERVER
          )
          headers = headers.set(
            'Content-Type',
            'application/x-www-form-urlencoded'
          )
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
            retry(3),
            catchError((error) => this._errorHandler.handleError(error)),
            switchMap((response) => {
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
        retry(3),
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
        retry(3),
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
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap(() => this._userService.refreshUserSession())
      )
  }
}
