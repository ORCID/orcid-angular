import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map, retry, switchMap, first } from 'rxjs/operators'

import { environment } from '../../../environments/environment'
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

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  constructor(
    private _http: HttpClient,
    private _titleService: Title,
    private _errorHandler: ErrorHandlerService,
    private _cookie: CookieService,
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
  
  // FOR AUTH SERVER SIGN IN
  let loginUrl = 'https://auth.dev.orcid.org/login'

  // FOR REGISTRY SIGN IN
  // let loginUrl = 'signin/auth.json'

    
  if (signInLocal.type && signInLocal.type === TypeSignIn.institutional) {
    loginUrl = 'shibboleth/signin/auth.json'
  }

  if (signInLocal.type && signInLocal.type === TypeSignIn.social) {
    loginUrl = 'social/signin/auth.json'
  }
  
  let csrf = this._cookie.get('AUTH-XSRF-TOKEN')
  
  //CODE TO SIGN IN WITH THE AUTH SERVER
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
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': 'https://dev.orcid.org',
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-xsrf-token': csrf
      }),
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
	  
	  // CODE TO SIGN IN WITH THE REGISTRY
    /*
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
        */
  }

  reactivation(username: string) {
    let body = new HttpParams({ encoder: new CustomEncoder() })
    body = body.set(isValidOrcidFormat(username) ? 'orcid' : 'email', username)
    return this._http
      .post<Reactivation>(environment.API_WEB + `sendReactivation.json`, body, {
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

  resendClaim(username: string) {
    let claim: Claim = {
      email: username,
      errors: [],
      successMessage: null,
    }
    let body = JSON.stringify(claim)

    return this._http
      .post<Claim>(environment.API_WEB + `resend-claim.json`, body, {
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
      .get<SignIn>(environment.API_WEB + 'userStatus.json?logUserOut=true', {
        withCredentials: true,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap(() => this._userService.refreshUserSession())
      )
  }
}
