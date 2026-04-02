import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { EMAIL_REGEXP } from 'src/app/constants'
import {
  SocialAccount,
  SocialAccountDeleteData,
  SocialAccountId,
} from 'src/app/types/account-alternate-sign-in.endpoint'
import { Institutional } from 'src/app/types/institutional.endpoint'

import { DiscoService } from '../disco/disco.service'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountSecurityAlternateSignInService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
  constructor(
    private _errorHandler: ErrorHandlerService,
    private _discoFeed: DiscoService,
    private _http: HttpClient
  ) {}

  get(): Observable<SocialAccount[]> {
    return this._http
      .get<SocialAccount[]>(
        runtimeEnvironment.API_WEB + `account/socialAccounts.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        switchMap((socialAccounts) => {
          return this._discoFeed.getDiscoFeed().pipe(
            map((feed) => {
              this.populateIdPNames({ socialAccounts, feed })
              this.populateEmails(socialAccounts)
              return socialAccounts
            })
          )
        }),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
  populateEmails(socialAccounts: SocialAccount[]) {
    socialAccounts.forEach(
      (account) => (account.email = this.getAccountDisplayEmail(account))
    )
  }
  private getAccountDisplayEmail(account: SocialAccount): string {
    if (account.email) {
      return account.email
    } else if (
      account.id?.provideruserid &&
      EMAIL_REGEXP.test(account.id?.provideruserid)
    ) {
      return account.id?.provideruserid
    } else {
      return account.displayname
    }
  }
  delete(data: SocialAccountDeleteData): Observable<SocialAccountDeleteData> {
    return this._http
      .post<SocialAccountDeleteData>(
        runtimeEnvironment.API_WEB + `account/revokeSocialAccount.json`,
        data,
        {
          headers: this.headers,
        }
      )
      .pipe(
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  populateIdPNames({
    socialAccounts,
    feed,
  }: {
    socialAccounts: SocialAccount[]
    feed: Institutional[]
  }): void {
    socialAccounts.forEach((account) => {
      if (
        account.id.providerid === 'facebook' ||
        account.id.providerid === 'google'
      ) {
        account.idpName =
          account.id.providerid.charAt(0).toUpperCase() +
          account.id.providerid.slice(1)
      } else {
        account.idpName = this._discoFeed.getInstitutionNameBaseOnIdFromObject(
          this._discoFeed.getInstitutionBaseOnIDFromObject(
            feed,
            account.id.providerid
          )
        )
      }
      if (!account.idpName) {
        account.idpName = account.id.providerid
      }
    })
  }
}
