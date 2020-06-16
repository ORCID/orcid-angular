import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, Subject, ReplaySubject } from 'rxjs'
import { environment } from '../../../environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RequestInfoForm } from '../../types/request-info-form.endpoint'
import { catchError, retry, tap } from 'rxjs/operators'
import { DeclareOauthSession } from 'src/app/types/declareOauthSession.endpoint'
import { OauthAuthorize } from 'src/app/types/authorize.endpoint'

@Injectable({
  providedIn: 'root',
})
export class OauthService {
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

  /**
   * @deprecated since declareOauthSession will declare and get the RequestInfoForm data.
   * the loadRequestInfoFormFromMemory should replace this
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
    // const value: OauthAuthorize = {
    //   tslint:disable-next-line: max-line-length
    //   TODO @angel please confirm that persistentTokenEnabled is always true https://github.com/ORCID/ORCID-Source/blob/master/orcid-web/src/main/webapp/static/javascript/ng1Orcid/app/modules/oauthAuthorization/oauthAuthorization.component.ts#L161
    //   persistentTokenEnabled: true,
    //   tslint:disable-next-line: max-line-length
    //   TODO @angel please confirm that  email access is always allowed know and at some point it was optional https://github.com/ORCID/ORCID-Source/blob/master/orcid-web/src/main/resources/freemarker/includes/oauth/scopes_ng2.ftl#L42
    //   emailAccessAllowed: true,
    //   approved,
    // }
    // return this._http
    //   .post<RequestInfoForm>(
    //     environment.BASE_URL + '/oauth/custom/authorize.json',
    //     value,
    //     { headers: this.headers }
    //   )
    //   .pipe(
    //     retry(3),
    //     catchError((error) => this._errorHandler.handleError(error)),
    //     tap((requestInfo) => {
    //       this.requestInfoSubject.next(requestInfo)
    //     })
    //   )

    return of(<RequestInfoForm>{
      errors: [],
      scopes: [
        {
          name: 'AUTHENTICATE',
          value: '/authenticate',
          description: 'Get your ORCID iD',
          longDescription:
            // tslint:disable-next-line: max-line-length
            'Allow this organization or application to get your 16-character ORCID iD and read information on your ORCID record you have marked as public.',
        },
        {
          name: 'OPENID',
          value: 'openid',
          description: 'Get your ORCID iD',
          longDescription:
            // tslint:disable-next-line: max-line-length
            'Allow this organization or application to get your 16-character ORCID iD and read information on your ORCID record you have marked as public.',
        },
      ],
      clientDescription: 'https://developers.google.com/oauthplayground\t',
      clientId: 'APP-MLXS7JVFJS9FEIFJ',
      clientName: 'test',
      clientEmailRequestReason: '',
      memberName: 'asda',
      redirectUrl: 'https://developers.google.com/oauthplayground?code=1R3eAY',
      responseType: 'code',
      stateParam: null,
      userId: null,
      userName: 'Leonardo Mendoza',
      userOrcid: '0000-0002-2036-7905',
      userEmail: null,
      userGivenNames: null,
      userFamilyNames: null,
      nonce: null,
      clientHavePersistentTokens: true,
      scopesAsString: '/authenticate openid',
    })
  }

  // call on by the Oauth Guard
  // it send the Oauth query parameters to the backend and gets back the requestInfoForm
  // if the backend has an error declaring the Oauth parameters it will return a string on the errors array

  declareOauthSession(value: DeclareOauthSession): Observable<RequestInfoForm> {
    // return this._http
    //   .post<RequestInfoForm>(
    //     environment.BASE_URL + '/oauth/custom/declare.json',
    //     value,
    //     { headers: this.headers }
    //   )
    //   .pipe(
    //     retry(3),
    //     catchError((error) => this._errorHandler.handleError(error))
    //   )
    return of(<RequestInfoForm>{
      errors: [],
      scopes: [
        {
          name: 'AUTHENTICATE',
          value: '/authenticate',
          description: 'Get your ORCID iD',
          longDescription:
            // tslint:disable-next-line: max-line-length
            'Allow this organization or application to get your 16-character ORCID iD and read information on your ORCID record you have marked as public.',
        },
        {
          name: 'OPENID',
          value: 'openid',
          description: 'Get your ORCID iD',
          longDescription:
            // tslint:disable-next-line: max-line-length
            'Allow this organization or application to get your 16-character ORCID iD and read information on your ORCID record you have marked as public.',
        },
      ],
      clientDescription: 'https://developers.google.com/oauthplayground\t',
      clientId: 'APP-MLXS7JVFJS9FEIFJ',
      clientName: 'test',
      clientEmailRequestReason: '',
      memberName: 'asda',
      redirectUrl: 'https://developers.google.com/oauthplayground?code=1R3eAY',
      responseType: 'code',
      stateParam: null,
      userId: null,
      userName: null,
      userOrcid: null,
      userEmail: null,
      userGivenNames: null,
      userFamilyNames: null,
      nonce: null,
      clientHavePersistentTokens: true,
      scopesAsString: '/authenticate openid',
    }).pipe(tap((data) => this.requestInfoSubject.next(data)))
  }
}
