import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import {
  ExpandedSearchResultsContent,
  SearchResultsByEmailOrOrcid,
} from 'src/app/types'
import {
  AccountTrustedIndividual,
  PersonDetails,
} from 'src/app/types/account-trusted-individuals'

import { ErrorHandlerService } from '../error-handler/error-handler.service'

export type DelegateInvitationLookupType = 'ORCID' | 'EMAIL'

export interface DelegateInvitationSearchRequest {
  lookupType: DelegateInvitationLookupType
  value: string
}

export interface DelegateInvitationSearchResult {
  status: string
  lookupType?: DelegateInvitationLookupType
  emailAddress?: string
  orcid?: string
  publicName?: string
  highlightedAffiliation?: string
  publicRecordUrl?: string
}

export interface DelegateInvitationNotice {
  invitationId: number
  status: string
  lookupType: DelegateInvitationLookupType
  enteredEmail: string | null
  lastModified: string | number | null
  recipientOrcid?: string | null
  recipientName?: string | null
}

export interface DelegateInvitationActionResult {
  status: string
}

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

  searchInvitation(
    request: DelegateInvitationSearchRequest
  ): Observable<DelegateInvitationSearchResult> {
    return this._http.post<DelegateInvitationSearchResult>(
      runtimeEnvironment.API_WEB + 'account/delegate-invitations/search.json',
      request,
      { headers: this.headers }
    )
  }

  sendInvitation(
    request: DelegateInvitationSearchRequest
  ): Observable<DelegateInvitationActionResult> {
    return this._http.post<DelegateInvitationActionResult>(
      runtimeEnvironment.API_WEB + 'account/delegate-invitations/send.json',
      request,
      { headers: this.headers }
    )
  }

  getInvitationNotices(): Observable<DelegateInvitationNotice[]> {
    return this._http.get<DelegateInvitationNotice[]>(
      runtimeEnvironment.API_WEB + 'account/delegate-invitations/notices.json',
      { headers: this.headers }
    )
  }

  acknowledgeInvitationNotice(
    invitationId: number
  ): Observable<DelegateInvitationActionResult> {
    return this._http.post<DelegateInvitationActionResult>(
      runtimeEnvironment.API_WEB +
        'account/delegate-invitations/notices/acknowledge.json',
      { invitationId },
      { headers: this.headers }
    )
  }

  get(): Observable<AccountTrustedIndividual[]> {
    return this._http
      .get<AccountTrustedIndividual[]>(
        runtimeEnvironment.API_WEB + `account/delegates.json`,
        { headers: this.headers }
      )
      .pipe(
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
      .pipe(catchError((error) => this._errorHandler.handleError(error)))
  }
  add(value: ExpandedSearchResultsContent) {
    return this._http
      .post<void>(
        runtimeEnvironment.API_WEB + `account/addDelegate.json`,
        { delegateToManage: value['orcid-id'] },
        { headers: this.headers }
      )
      .pipe(
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
      .pipe(catchError((error) => this._errorHandler.handleError(error)))
  }
  addByEmail(delegateEmail: string) {
    return this._http
      .post<void>(
        runtimeEnvironment.API_WEB + `account/addDelegateByEmail.json`,
        { delegateEmail },
        { headers: this.headers }
      )
      .pipe(
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
      .pipe(catchError((error) => this._errorHandler.handleError(error)))
  }
  addByOrcid(delegateToManage: string) {
    return this._http
      .post<void>(
        runtimeEnvironment.API_WEB + `account/addDelegateByOrcid.json`,
        { delegateToManage },
        { headers: this.headers }
      )
      .pipe(
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.updateTrustedIndividualsSuccess.next())
      )
  }
}
