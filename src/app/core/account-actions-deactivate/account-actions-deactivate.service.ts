import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import {
  DeactivationEndpoint,
  ExpiringLinkVerification,
} from 'src/app/types/common.endpoint'

export interface DeactivateResponse {
  email: string
}

@Injectable({
  providedIn: 'root',
})
export class AccountActionsDeactivateService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
  options: { headers: any; responseType: 'text' }

  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {
    this.options = { headers: this.headers, responseType: 'text' as 'text' }
  }

  verifyDeactivationToken(token: string): Observable<ExpiringLinkVerification> {
    return this._http
      .get<ExpiringLinkVerification>(
        runtimeEnvironment.API_WEB + `account/deactivate/` + token
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  deactivateAccount(
    data: DeactivationEndpoint,
    token: string
  ): Observable<DeactivationEndpoint> {
    return this._http
      .post<DeactivationEndpoint>(
        runtimeEnvironment.API_WEB + `account/deactivate/` + token,
        data
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  generateDeactivationLink(): Observable<DeactivateResponse> {
    return this._http
      .post<DeactivateResponse>(
        runtimeEnvironment.API_WEB + `account/send-deactivate-account.json`,
        this.options
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
