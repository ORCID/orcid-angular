import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, Subject } from 'rxjs'
import { catchError, map, retry, tap } from 'rxjs/operators'
import { ERROR_REPORT } from 'src/app/errors'
import {
  ExpandedSearchResultsContent,
  SearchResultsByEmail,
} from 'src/app/types'
import {
  AccountTrustedIndividual,
  PersonDetails,
} from 'src/app/types/account-trusted-individuals'
import { AccountTrustedOrganization } from 'src/app/types/account-trusted-organizations'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountTrustedIndividualsService {
  addTrustedIndividualsSuccess = new Subject<void>()

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })
  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {}

  get(): Observable<AccountTrustedIndividual[]> {
    return this._http
      .get<AccountTrustedIndividual[]>(
        environment.API_WEB + `account/delegates.json`,
        { headers: this.headers }
      )
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
        environment.API_WEB + `account/revokeDelegate.json`,
        { delegateToManage: account.receiverOrcid.path },
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getPersonDetails(orcid: string) {
    return this._http
      .get<PersonDetails>(environment.API_PUB + `${orcid}/personal-details`, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
  add(value: ExpandedSearchResultsContent) {
    return this._http
      .post<void>(
        environment.API_WEB + `account/addDelegate.json`,
        { delegateToManage: value['orcid-id'] },
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.addTrustedIndividualsSuccess.next())
      )
  }
  searchByEmail(email: string): Observable<SearchResultsByEmail> {
    return this._http
      .get<SearchResultsByEmail>(
        environment.API_WEB +
          `manage/search-for-delegate-by-email/${encodeURIComponent(email)}/`,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.addTrustedIndividualsSuccess.next())
      )
  }
  addByEmail(delegateEmail: string) {
    return this._http
      .post<void>(
        environment.API_WEB + `account/addDelegateByEmail.json/`,
        { delegateEmail },
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.addTrustedIndividualsSuccess.next())
      )
  }
}
