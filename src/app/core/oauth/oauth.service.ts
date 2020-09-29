import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { NEVER, Observable, of, ReplaySubject } from 'rxjs'
import {
  catchError,
  last,
  map,
  retry,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators'
import { WINDOW } from 'src/app/cdk/window'
import { ERROR_REPORT } from 'src/app/errors'
import { OauthParameters, RequestInfoForm } from 'src/app/types'
import { OauthAuthorize } from 'src/app/types/authorize.endpoint'
import { UserSessionUpdateParameters } from 'src/app/types/session.local'

import { environment } from '../../../environments/environment'
import { SignInData } from '../../types/sign-in-data.endpoint'
import { TwoFactor } from '../../types/two-factor.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

const OAUTH_SESSION_ERROR_CODES_HANDLE_BY_CLIENT_APP = [
  'login_required',
  'interaction_required',
  'invalid_scope',
  'unsupported_response_type',
]

@Injectable({
  providedIn: 'root',
})
export class OauthService {
  private headers: HttpHeaders
  private requestInfoSubject = new ReplaySubject<RequestInfoForm>(1)
  private declareOauthSession$

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _router: Router,
    @Inject(WINDOW) private window: Window
  ) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    })
  }

  /**
   * @deprecated in favor of only getting the oauth session data through the user service
   */
  loadRequestInfoFormFromMemory(): Observable<RequestInfoForm> {
    return this.requestInfoSubject
  }
  /**
   * @deprecated in favor of only getting the oauth session data through the user service
   */
  updateRequestInfoFormInMemory(requestInfoForm: RequestInfoForm) {
    this.requestInfoSubject.next(requestInfoForm)
  }

  loadRequestInfoForm(): Observable<RequestInfoForm> {
    return this._http
      .get<RequestInfoForm>(
        environment.BASE_URL +
          'oauth/custom/authorize/get_request_info_form.json',
        { headers: this.headers }
      )
      .pipe(
        // Return null if the requestInfo is empty
        map((requestInfo) => (requestInfo.clientId ? requestInfo : undefined)),
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  authorize(approved: boolean): Observable<RequestInfoForm> {
    const value: OauthAuthorize = {
      // tslint:disable-next-line: max-line-length
      // TODO @angel please confirm that persistentTokenEnabled is always true https://github.com/ORCID/ORCID-Source/blob/master/orcid-web/src/main/webapp/static/javascript/ng1Orcid/app/modules/oauthAuthorization/oauthAuthorization.component.ts#L161
      // TODO @angel by looking into analytics, I can see we have never reported a persistentTokenDisabled
      persistentTokenEnabled: true,
      // tslint:disable-next-line: max-line-length
      // TODO @angel please confirm that  email access is always allowed know and at some point it was optional https://github.com/ORCID/ORCID-Source/blob/master/orcid-web/src/main/resources/freemarker/includes/oauth/scopes_ng2.ftl#L42
      emailAccessAllowed: true,
      approved,
    }
    return this._http
      .post<RequestInfoForm>(
        environment.BASE_URL + 'oauth/custom/authorize.json',
        value,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        ),
        tap((requestInfo) => {
          this.requestInfoSubject.next(requestInfo)
        })
      )
  }

  /**
   * @param queryParameters Orcid supported OAuth parameters
   *
   *  Important: Avoid calling this method directly, since getting the oauth RequestInfo from the UserService.getSession is preferred
   *
   *  After the first call to this method it will keep returning the same observable, ignoring new or different queryParameters
   *  this is not an issue since the Oauth session will only be refresh if the app is reloaded with a new Oauth URL
   *
   */
  declareOauthSession(
    queryParameters: OauthParameters,
    updateParameters?: UserSessionUpdateParameters
  ): Observable<RequestInfoForm> {
    if (
      !this.declareOauthSession$ ||
      updateParameters.checkTrigger.timerUpdate === undefined
    ) {
      this.declareOauthSession$ = this._http
        .post<RequestInfoForm>(
          environment.BASE_URL +
            `oauth/custom/init.json?${this.objectToUrlParameters(
              queryParameters
            )}`,
          queryParameters,
          { headers: this.headers }
        )
        .pipe(
          retry(3),
          catchError((error) =>
            this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
          ),
          switchMap((session) => this.handleSessionErrors(session)),
          shareReplay(1)
        )
      return this.declareOauthSession$.pipe(last())
    } else {
      return this.declareOauthSession$.pipe(last())
    }
  }

  handleSessionErrors(session: RequestInfoForm): Observable<RequestInfoForm> {
    if (
      session.error &&
      OAUTH_SESSION_ERROR_CODES_HANDLE_BY_CLIENT_APP.find(
        (x) => x === session.error
      )
    ) {
      // Redirect error that are handle by the client application
      this.window.location.href = `${session.redirectUrl}#error=${session.error}`
      return NEVER
    } else if (session.error || (session.errors && session.errors.length)) {
      // Send the user to the signin and display a toaster error
      let extra = {}
      if (
        session.error === 'oauth_error' ||
        session.error === 'invalid_grant'
      ) {
        extra = { error: session.errorDescription }
      }
      this._router
        .navigate(['/signin'], { queryParams: extra })
        .then((navigated: boolean) => {
          if (navigated) {
            this._errorHandler
              .handleError(
                new Error(
                  `${session.error || session.errors}.${
                    session.errorDescription
                  }`
                ),
                ERROR_REPORT.OAUTH_PARAMETERS
              )
              .subscribe()
          }
        })
    }
    return of(session)
  }
  /**
   * @deprecated in favor of using the same `oauth/custom/init.json` endpoint to
   * initialize Oauth, initialize Oauth after a login or initialize Oauth after a logout
   */
  updateOauthSession(value: OauthParameters): Observable<RequestInfoForm> {
    return this._http
      .get<RequestInfoForm>(
        environment.BASE_URL +
          // tslint:disable-next-line:max-line-length
          `oauth/custom/authorize.json?${this.objectToUrlParameters(value)}`,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  loadShibbolethSignInData(): Observable<SignInData> {
    return this._http
      .get<SignInData>(environment.BASE_URL + 'shibboleth/signinData.json', {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  loadSocialSigninData(): Observable<SignInData> {
    return this._http
      .get<SignInData>(environment.BASE_URL + 'social/signinData.json', {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  submitCode(twoFactor: TwoFactor, social?) {
    let url = 'shibboleth/2FA/submitCode.json'
    if (social) {
      url = 'social/2FA/submitCode.json'
    }
    return this._http
      .post<TwoFactor>(environment.BASE_URL + url, twoFactor, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  objectToUrlParameters(object: Object) {
    return Object.keys(object)
      .map((key) => `${key}=${encodeURIComponent(object[key])}`)
      .join('&')
  }
}
