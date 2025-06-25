import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http'
import { CustomEncoder } from '../custom-encoder/custom.encoder'
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
import { ApplicationRoutes } from 'src/app/constants'
import { ERROR_REPORT } from 'src/app/errors'
import { OauthParameters, RequestInfoForm } from 'src/app/types'
import { OauthAuthorize } from 'src/app/types/authorize.endpoint'
import { UserSessionUpdateParameters } from 'src/app/types/session.local'

import { SignInData } from '../../types/sign-in-data.endpoint'
import { TwoFactor } from '../../types/two-factor.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { objectToUrlParameters } from '../../constants'
import { CookieService } from 'ngx-cookie-service'

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
  private redirectUriSubject = new ReplaySubject<string>(1)
  private declareOauthSession$

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _router: Router,
    private _cookie: CookieService,
    @Inject(WINDOW) private window: Window
  ) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
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

  /**
   * @deprecated Oauth session are not require to be persistent since https://github.com/ORCID/orcid-angular/pull/609
   */
  loadRequestInfoForm(): Observable<RequestInfoForm> {
    return this._http
      .get<RequestInfoForm>(
        runtimeEnvironment.BASE_URL + 'oauth/custom/requestInfoForm.json',
        { headers: this.headers }
      )
      .pipe(
        // Return null if the requestInfo is empty
        map((requestInfo) => (requestInfo.clientId ? requestInfo : undefined)),
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap((session) => this.handleSessionErrors(session))
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
        runtimeEnvironment.BASE_URL + 'oauth/custom/authorize.json',
        value,
        { headers: this.headers, withCredentials: true }
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

  authorizeOnAuthServer(data: RequestInfoForm): Observable<string> {
    let headers = new HttpHeaders()
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
    
    let body = new HttpParams({ encoder: new CustomEncoder() })
      .set('client_id', data.clientId)
      .set('state', data.oauthState)
    
    for(var s of data.scopes) {
      body = body.append('scope', s.value);
    }    

    return this._http
      .post(
        runtimeEnvironment.AUTH_SERVER + 'oauth2/authorize',
        body,
        { headers, withCredentials: true }
      )
      .pipe(
        tap((res: HttpResponse<any>) => {
          console.log('—--- Response headers —---');
          res.headers.keys().forEach(key =>
            console.log(`${key}: ${res.headers.get(key)}`)
          );
          console.log('———————————————');
        }),
        switchMap(res => of(res.headers.get('location')))
      );
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
          runtimeEnvironment.BASE_URL +
            `oauth/custom/init.json?${objectToUrlParameters(queryParameters)}`,
          queryParameters,
          { headers: this.headers }
        )
        .pipe(
          retry(3),
          catchError((error) =>
            this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
          ),
          switchMap((session) =>
            this.handleSessionErrors(session, queryParameters)
          ),
          shareReplay(1)
        )
      return this.declareOauthSession$.pipe(last())
    } else {
      return this.declareOauthSession$.pipe(last())
    }
  }

  handleSessionErrors(
    session: RequestInfoForm,
    queryParameters?: OauthParameters
  ): Observable<RequestInfoForm> {
    if (!session) {
      return of(null)
    }
    if (
      session.error &&
      OAUTH_SESSION_ERROR_CODES_HANDLE_BY_CLIENT_APP.find(
        (x) => x === session.error
      )
    ) {
      // Redirect error that is handle by the client application
      ;(this.window as any).outOfRouterNavigation(
        `${session.redirectUrl}#error=${session.error}`
      )
      return NEVER
    } else if (session.error || (session.errors && session.errors.length)) {
      // Send the user to the oauth page to see the error
      this._router
        .navigate([ApplicationRoutes.authorize], {
          queryParams: queryParameters,
        })
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

  loadShibbolethSignInData(): Observable<SignInData> {
    return this._http
      .get<SignInData>(
        runtimeEnvironment.BASE_URL + 'shibboleth/signinData.json',
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  loadSocialSigninData(): Observable<SignInData> {
    return this._http
      .get<SignInData>(runtimeEnvironment.BASE_URL + 'social/signinData.json', {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }
}
