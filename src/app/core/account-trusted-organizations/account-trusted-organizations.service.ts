import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { ERROR_REPORT } from 'src/app/errors'
import { AccountTrustedOrganization } from 'src/app/types/account-trusted-organizations'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountTrustedOrganizationsService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })
  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {}

  get(): Observable<AccountTrustedOrganization[]> {
    return this._http
      .get<AccountTrustedOrganization[]>(
        environment.API_WEB + `account/get-trusted-orgs.json`,
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
        environment.API_WEB +
          `account/revoke-application.json?clientId=` +
          account.orcidPath,
        undefined,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
