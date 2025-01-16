import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

import { PeerReview } from '../../types/record-peer-review.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { RecordImportWizard } from '../../types/record-peer-review-import.endpoint'
import { catchError, first, map, retry, switchMap, tap } from 'rxjs/operators'
import { VisibilityStrings } from '../../types/common.endpoint'
import { TogglzService } from '../togglz/togglz.service'

@Injectable({
  providedIn: 'root',
})
export class RecordPeerReviewService {
  $peer: ReplaySubject<PeerReview[]> = new ReplaySubject<PeerReview[]>()
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
  lastEmittedValue: PeerReview[]

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _togglz: TogglzService
  ) {}

  getPeerReviewGroups(options: UserRecordOptions): Observable<PeerReview[]> {
    if (options?.cleanCacheIfExist && this.$peer) {
      this.$peer.next(<PeerReview[]>undefined)
    }

    let url: string
    if (options.publicRecordId) {
      url = options.publicRecordId + '/peer-reviews-minimized.json?sortAsc='
    } else {
      url = 'peer-reviews/peer-reviews-minimized.json?sortAsc='
    }

    this._http
      .get<PeerReview[]>(
        runtimeEnvironment.API_WEB +
          url +
          (options.sortAsc != null ? options.sortAsc : true)
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        catchError(() => of([])),
        tap((data) => {
          this.lastEmittedValue = data
          this.$peer.next(data)
        })
      )
      .subscribe()

    return this.$peer.asObservable()
  }

  getPeerReviewsByGroupId(
    options: UserRecordOptions,
    groupId
  ): Observable<PeerReview[]> {
    if (options?.publicRecordId) {
      return this._http
        .get<PeerReview[]>(
          runtimeEnvironment.API_WEB +
            options.publicRecordId +
            '/peer-reviews-by-group-id.json?sortAsc=' +
            (options.sortAsc != null ? options.sortAsc : true) +
            '&groupId=' +
            encodeURIComponent(groupId)
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          catchError(() => of([]))
        )
    } else {
      return this._http
        .get<PeerReview[]>(
          runtimeEnvironment.API_WEB +
            'peer-reviews/peer-reviews-by-group-id.json?sortAsc=' +
            (options.sortAsc != null ? options.sortAsc : true) +
            '&groupId=' +
            encodeURIComponent(groupId)
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          catchError(() => of([]))
        )
    }
  }

  changeUserRecordContext(userRecordContext: UserRecordOptions) {
    this.getPeerReviewGroups(userRecordContext).subscribe()
  }

  getPeerReviewById(putCode: number): Observable<PeerReview> {
    return this._http.get<PeerReview>(
      runtimeEnvironment.API_WEB +
        'peer-reviews/peer-review.json?putCode=' +
        putCode
    )
  }

  getPeerReviewImportWizardList(): Observable<RecordImportWizard[]> {
    return this._http.get<RecordImportWizard[]>(
      runtimeEnvironment.API_WEB +
        'workspace/retrieve-peer-review-import-wizards.json'
    )
  }

  getPublicPeerReviewById(orcid: string, putCode: number): Observable<any> {
    return this._http.get(
      runtimeEnvironment.API_WEB +
        orcid +
        '/peer-review.json?putCode=' +
        putCode
    )
  }

  updateVisibility(
    groupId: any,
    visibility: VisibilityStrings
  ): Observable<any> {
    return this._http
      .post(
        runtimeEnvironment.API_WEB +
          'peer-reviews/' +
          groupId +
          '/visibility/' +
          visibility,
        null
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => {
          if (groupId) {
            this.getPeerReviewsByGroupId({ forceReload: true }, groupId)
          } else {
            this.getPeerReviewGroups({ forceReload: true })
          }
        })
      )
  }

  delete(putCode: string): Observable<any> {
    return this._http
      .delete(runtimeEnvironment.API_WEB + 'peer-reviews/' + putCode, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getPeerReviewGroups({ forceReload: true }))
      )
  }

  updatePreferredSource(putCode: string): Observable<any> {
    return this._http
      .get(
        runtimeEnvironment.API_WEB +
          'peer-reviews/updateToMaxDisplay.json?putCode=' +
          putCode
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getPeerReviewGroups({ forceReload: true }))
      )
  }
}
