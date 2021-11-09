import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map, retry, switchMap, first } from 'rxjs/operators'

import { environment } from '../../../environments/environment'
import { getOrcidNumber } from '../../constants'
import { Reactivation } from '../../types/reactivation.endpoint'
import { SignIn } from '../../types/sign-in.endpoint'
import { SignInLocal, TypeSignIn } from '../../types/sign-in.local'
import { CustomEncoder } from '../custom-encoder/custom.encoder'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { UserService } from '../user/user.service'
import { ERROR_REPORT } from 'src/app/errors'

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  private headers: HttpHeaders

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _userService: UserService
  ) {
    this.headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded;charset=utf-8'
    )
  }
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
    let loginUrl = 'signin/auth.json'

    if (signInLocal.type && signInLocal.type === TypeSignIn.institutional) {
      loginUrl = 'shibboleth/signin/auth.json'
    }

    if (signInLocal.type && signInLocal.type === TypeSignIn.social) {
      loginUrl = 'social/signin/auth.json'
    }

    let body = new HttpParams({ encoder: new CustomEncoder() })
      .set('userId', getOrcidNumber(signInLocal.data.username))
      .set('password', signInLocal.data.password)
    if (signInLocal.data.verificationCode) {
      body = body.set('verificationCode', signInLocal.data.verificationCode)
    }
    if (signInLocal.data.recoveryCode) {
      body = body.set('recoveryCode', signInLocal.data.recoveryCode)
    }
    body = body.set('oauthRequest', signInLocal.isOauth ? 'true' : 'false')
    return this._http
      .post<SignIn>(environment.API_WEB + loginUrl, body, {
        headers: this.headers,
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
  }

  reactivation(email: string) {
    let body = new HttpParams({ encoder: new CustomEncoder() })
    body = body.set('email', email)
    return this._http
      .post<Reactivation>(environment.API_WEB + `sendReactivation.json`, body, {
        headers: this.headers,
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
    return this._http
      .get<SignIn>(environment.API_WEB + 'userStatus.json?logUserOut=true', {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap(() => this._userService.refreshUserSession())
      )
  }
}
