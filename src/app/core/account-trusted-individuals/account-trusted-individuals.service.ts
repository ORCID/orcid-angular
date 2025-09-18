import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { catchError, map, retry, tap } from 'rxjs/operators'
import {
  ExpandedSearchResultsContent,
  SearchResultsByEmailOrOrcid,
} from 'src/app/types'
import {
  AccountTrustedIndividual,
  PersonDetails,
} from 'src/app/types/account-trusted-individuals'

import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountTrustedIndividualsService {
  updateTrustedIndividualsSuccess = new Subject<void>()

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {}

  get(): Observable<AccountTrustedIndividual[]> {
    return this._http
      .get<
        AccountTrustedIndividual[]
      >(runtimeEnvironment.API_WEB + `account/delegates.json`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        map((x) => {
          return x.map((x) => {
            x.receiverName.value =
              x.receiverName.value ||
              $localize`:@@account.nameIsPri:Name is private`
            return x
          })
        })
      )
  }

  delete(account: AccountTrustedIndividual): Observable<void> {
    return this._http
      .post<void>(
        runtimeEnvironment.API_WEB + `account/revokeDelegate.json`,
        { delegateToManage: account.receiverOrcid.path },
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.updateTrustedIndividualsSuccess.next())
      )
  }

  getPersonDetails(orcid: string) {
    return this._http
      .get<PersonDetails>(
        runtimeEnvironment.API_PUB + `${orcid}/personal-details`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
  add(value: ExpandedSearchResultsContent) {
    return this._http
      .post<void>(
        runtimeEnvironment.API_WEB + `account/addDelegate.json`,
        { delegateToManage: value['orcid-id'] },
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.updateTrustedIndividualsSuccess.next())
      )
  }
  searchByEmail(email: string): Observable<SearchResultsByEmailOrOrcid> {
    return this._http
      .get<SearchResultsByEmailOrOrcid>(
        runtimeEnvironment.API_WEB +
          `account/search-for-delegate-by-email/${encodeURIComponent(email)}/`,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
  addByEmail(delegateEmail: string) {
    return this._http
      .post<void>(
        runtimeEnvironment.API_WEB + `account/addDelegateByEmail.json/`,
        { delegateEmail },
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.updateTrustedIndividualsSuccess.next())
      )
  }

  searchByOrcid(email: string): Observable<SearchResultsByEmailOrOrcid> {
    return this._http
      .get<SearchResultsByEmailOrOrcid>(
        runtimeEnvironment.API_WEB +
          `account/search-for-delegate-by-orcid/${encodeURIComponent(email)}/`,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
  addByOrcid(delegateToManage: string) {
    return this._http
      .post<void>(
        runtimeEnvironment.API_WEB + `account/addDelegateByOrcid.json`,
        { delegateToManage },
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.updateTrustedIndividualsSuccess.next())
      )
  }
}
