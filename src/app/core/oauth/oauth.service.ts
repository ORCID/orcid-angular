import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, Subject, ReplaySubject } from 'rxjs'
import { environment } from '../../../environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { catchError, retry, tap } from 'rxjs/operators'
import { OauthAuthorize } from 'src/app/types/authorize.endpoint'
import { RequestInfoForm, OauthParameters } from 'src/app/types'
import { SignInData } from '../../types/sign-in-data.endpoint'

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

  // call on by the OauthGuard
  // it send the Oauth query parameters to the backend and gets back the requestInfoForm
  // if the backend has an error declaring the Oauth parameters it will return a string on the errors array

  declareOauthSession(value: OauthParameters): Observable<RequestInfoForm> {
    if (this.oauthSectionDeclared) {
      return this.requestInfoSubject
    }

    return this._http
      .post<RequestInfoForm>(
        environment.BASE_URL +
          // tslint:disable-next-line:max-line-length
          `oauth/custom/init.json?client_id=${value.client_id}&response_type=${value.response_type}&scope=${value.scope}&redirect_uri=${value.redirect_uri}`,
        value,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
      .pipe(
        tap((data) => {
          this.requestInfoSubject.next(data)
          this.oauthSectionDeclared = true
        })
      )
  }

  updateOauthSession(value: OauthParameters): Observable<RequestInfoForm> {
    return this._http
      .get<RequestInfoForm>(
        environment.BASE_URL +
          // tslint:disable-next-line:max-line-length
          `oauth/custom/authorize.json?client_id=${value.client_id}&response_type=${value.response_type}&scope=${value.scope}&redirect_uri=${value.redirect_uri}`,
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
}
