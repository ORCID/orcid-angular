import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import {
  SocialAccount,
  SocialAccountDeleteResponse,
  SocialAccountId,
} from 'src/app/types/account-alternate-sign-in.endpoint'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountSecurityAlternateSignInService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })
  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {}

  get(): Observable<SocialAccount[]> {
    return this._http
      .get<SocialAccount[]>(
        environment.API_WEB + `account/socialAccounts.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
  delete(deleteId: SocialAccountId): Observable<SocialAccountDeleteResponse> {
    return this._http
      .post<SocialAccountDeleteResponse>(
        environment.API_WEB + `account/revokeSocialAccount.json`,
        deleteId,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
