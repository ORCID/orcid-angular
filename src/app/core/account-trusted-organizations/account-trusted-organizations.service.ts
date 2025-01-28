import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { AccountTrustedOrganization } from 'src/app/types/account-trusted-organizations'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountTrustedOrganizationsService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {}

  get(): Observable<AccountTrustedOrganization[]> {
    return this._http
      .get<AccountTrustedOrganization[]>(
        runtimeEnvironment.API_WEB + `account/get-trusted-orgs.json`,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  delete(
    account: AccountTrustedOrganization
  ): Observable<AccountTrustedOrganization[]> {
    return this._http
      .post<AccountTrustedOrganization[]>(
        runtimeEnvironment.API_WEB +
          `account/revoke-application.json?clientId=` +
          account.clientId,
        undefined,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
