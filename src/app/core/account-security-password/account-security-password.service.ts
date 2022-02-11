import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { AccountPasswordEndpoint } from 'src/app/types/account-settings-password'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountSecurityPasswordService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {}

  updatePassword(
    accountPassword: AccountPasswordEndpoint
  ): Observable<AccountPasswordEndpoint> {
    return this._http
      .post<AccountPasswordEndpoint>(
        environment.API_WEB + `account/change-password.json`,
        accountPassword,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
