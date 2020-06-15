import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { environment } from '../../../environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import {
  RequestInfoForm,
  OauthAuthorize,
} from '../../types/request-info-form.endpoint'
import { catchError, retry } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class OauthService {
  private headers: HttpHeaders

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    })
  }

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

  authorize(approved: boolean) {
    //   const value: OauthAuthorize = {
    // tslint:disable-next-line: max-line-length
    //     // TODO @angel please confirm that persistentTokenEnabled is always true https://github.com/ORCID/ORCID-Source/blob/master/orcid-web/src/main/webapp/static/javascript/ng1Orcid/app/modules/oauthAuthorization/oauthAuthorization.component.ts#L161
    //     persistentTokenEnabled: true,
    // tslint:disable-next-line: max-line-length
    //     // TODO @angel please confirm that  email access is always allowed know and at some point it was optional https://github.com/ORCID/ORCID-Source/blob/master/orcid-web/src/main/resources/freemarker/includes/oauth/scopes_ng2.ftl#L42
    //     emailAccessAllowed: true,
    //     approved,
    //   }
    //   return this._http
    //     .post<RequestInfoForm>(
    //       environment.BASE_URL + '/oauth/custom/authorize.json',
    //       value,
    //       { headers: this.headers }
    //     )
    //     .pipe(
    //       retry(3),
    //       catchError((error) => this._errorHandler.handleError(error))
    //     )
    return of({
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
}
