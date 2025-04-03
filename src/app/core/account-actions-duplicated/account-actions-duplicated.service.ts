import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { ERROR_REPORT } from 'src/app/errors'
import { DuplicateRemoveEndpoint } from 'src/app/types/account-actions-duplicated'

import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountActionsDuplicatedService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {}

  confirmDeprecate(
    account: DuplicateRemoveEndpoint
  ): Observable<DuplicateRemoveEndpoint> {
    return this._http
      .post<DuplicateRemoveEndpoint>(
        runtimeEnvironment.API_WEB + `account/confirm-deprecate-profile.json`,
        account,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  deprecate(
    account: DuplicateRemoveEndpoint
  ): Observable<DuplicateRemoveEndpoint> {
    return this._http
      .post<DuplicateRemoveEndpoint>(
        runtimeEnvironment.API_WEB + `account/validate-deprecate-profile.json`,
        account,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
