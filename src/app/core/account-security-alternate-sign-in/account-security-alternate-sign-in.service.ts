import { HttpHeaders, HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { retry, catchError } from 'rxjs/operators'
import { of } from 'rxjs'
import {
  SocialAccount,
  SocialAccountId,
  SocialAccountDeleteResponse,
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
    return of([
      {
        dateCreated: 1620999337209,
        lastModified: 1620999344430,
        id: {
          userid: '-6257892940619007911',
          providerid: 'facebook',
          provideruserid: '10206988298263273',
        },
        accesstoken:
          'EAALGNO62uUcBAB24ZCTYRF1QBnwx9FK4fZBKtN3bqCsIZCjTBN3M4nsC6qQCUyNiTXY4fr6e0XAGaoGBF4BB1u5oXZBIHP2oMZBn92qQxIuAIyc15FSDWnG3py7JjZCRInPhxMOrcuwkbZBc5m7W1j04gV6aZCM6AWXJBulZCzJxfhETDVFFBjyO2',
        displayname: 'Leonardo Mendoza',
        email: 'leomendoza123@gmail.com',
        expiretime: 5183999,
        imageurl: null,
        lastLogin: 1620999337208,
        orcid: '0000-0002-2036-7905',
        profileurl: null,
        rank: 1,
        refreshtoken: null,
        secret: null,
        idType: null,
        headersJson: null,
        connectionSatus: 'STARTED',
        accountIdForDisplay: 'leomendoza123@gmail.com',
        linked: true,
      },
    ])
    // return this._http
    //   .get<SocialAccount[]>(
    //     environment.API_WEB + `account/socialAccounts.json`,
    //     {
    //       headers: this.headers,
    //     }
    //   )
    //   .pipe(
    //     retry(3),
    //     catchError((error) => this._errorHandler.handleError(error))
    //   )
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
