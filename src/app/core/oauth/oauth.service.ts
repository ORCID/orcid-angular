import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, retry, tap, switchMap } from 'rxjs/operators'
import { OauthParameters, RequestInfoForm } from 'src/app/types'
import { OauthAuthorize } from 'src/app/types/authorize.endpoint'

import { environment } from '../../../environments/environment'
import { SignInData } from '../../types/sign-in-data.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class OauthService {
  private oauthSectionDeclared = false
  private headers: HttpHeaders
  private requestInfoSubject = new ReplaySubject<RequestInfoForm>(1)

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
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

  updateRequestInfoFormInMemory(requestInfoForm: RequestInfoForm) {
    this.requestInfoSubject.next(requestInfoForm)
  }

  /**
   * @deprecated since declareOauthSession will declare and get the RequestInfoForm data.
   * the loadRequestInfoFormFromMemory can replace this function
   */
  loadRequestInfoForm(): Observable<RequestInfoForm> {
    return this._http
      .get<RequestInfoForm>(
        environment.BASE_URL +
          'oauth/custom/authorize/get_request_info_form.json',
        { headers: this.headers }
      )
      .pipe(
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
        catchError((error) => this._errorHandler.handleError(error)),
        tap((requestInfo) => {
          this.requestInfoSubject.next(requestInfo)
        })
      )
  }

  /**
   * @param queryParameters Orcid supported OAuth parameters
   * @param forceRefresh if true updates oauth section even when there is an existing one
   *
   *  it sends the Oauth query parameters to the backend only on the first call or if `forceRefresh` is true
   *  Important: Avoid calling this method directly, since getting the oauth RequestInfo from the UserService.getSession is preferred
   *
   * @returns a hot observable with the oauth RequestInfoForm
   */
  declareOauthSession(
    queryParameters: OauthParameters,
    forceRefresh = false
  ): Observable<RequestInfoForm> {
    if (this.oauthSectionDeclared && !forceRefresh) {
      return this.requestInfoSubject
    }

    return this._http
      .post<RequestInfoForm>(
        environment.BASE_URL +
          // tslint:disable-next-line:max-line-length
          `oauth/custom/init.json?${this.objectToUrlParameters(
            queryParameters
          )}`,
        queryParameters,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap((data) => {
          this.requestInfoSubject.next(data)
          this.oauthSectionDeclared = true
        }),
        switchMap(() => this.requestInfoSubject)
      )
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
      .pipe(
        tap((data) => {
          this.requestInfoSubject.next(data)
        })
      )
  }

  loadShibbolethSignInData(): Observable<SignInData> {
    return this._http.get<SignInData>(
      environment.BASE_URL + 'shibboleth/signinData.json',
      { headers: this.headers }
    )
  }

  loadSocialSigninData(): Observable<SignInData> {
    return this._http.get<SignInData>(
      environment.BASE_URL + 'social/signinData.json',
      { headers: this.headers }
    )
  }

  objectToUrlParameters(object: Object) {
    return Object.keys(object)
      .map((key) => `${key}=${encodeURIComponent(object[key])}`)
      .join('&')
  }
}
