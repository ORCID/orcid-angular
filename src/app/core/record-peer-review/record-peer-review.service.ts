import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { environment } from '../../../environments/environment'
import { PeerReview } from '../../types/record-peer-review.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { RecordImportWizard } from '../../types/record-peer-review-import.endpoint'
import { retry, catchError, tap } from 'rxjs/operators'
import { VisibilityStrings } from '../../types/common.endpoint'
import { cloneDeep } from 'lodash'

@Injectable({
  providedIn: 'root',
})
export class RecordPeerReviewService {
  $peer: ReplaySubject<PeerReview[]> = new ReplaySubject<PeerReview[]>()
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })
  lastEmittedValue: PeerReview[]

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getPeerReviewGroups(options: UserRecordOptions): Observable<PeerReview[]> {
    if (options?.publicRecordId) {
      this._http
        .get<PeerReview[]>(
          environment.API_WEB +
            options.publicRecordId +
            '/peer-reviews.json?sortAsc=' +
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
    } else {
      if (!this.$peer) {
        this.$peer = new ReplaySubject(1)
      } else if (!options.forceReload) {
        return this.$peer
      }

      if (options.cleanCacheIfExist && this.$peer) {
        this.$peer.next(undefined)
      }

      this._http
        .get<PeerReview[]>(
          environment.API_WEB +
            'peer-reviews/peer-reviews.json?sortAsc=' +
            (options.sortAsc != null ? options.sortAsc : true)
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          catchError(() => of([])),
          tap((value) => {
            this.lastEmittedValue = cloneDeep(value)
            this.$peer.next(value)
          })
        )
        .subscribe()
      return this.$peer.asObservable()
    }
  }

  changeUserRecordContext(userRecordContext: UserRecordOptions) {
    this.getPeerReviewGroups(userRecordContext).subscribe()
  }

  getPeerReviewById(putCode: number): Observable<PeerReview> {
    return this._http.get<PeerReview>(
      environment.API_WEB + 'peer-reviews/peer-review.json?putCode=' + putCode
    )
  }

  getPeerReviewImportWizardList(): Observable<RecordImportWizard[]> {
    return this._http.get<RecordImportWizard[]>(
      environment.API_WEB + 'workspace/retrieve-peer-review-import-wizards.json'
    )
  }

  getPublicPeerReviewById(orcid: string, putCode: number): Observable<any> {
    return this._http.get(
      environment.API_WEB + orcid + '/peer-review.json?putCode=' + putCode
    )
  }

  updateVisibility(
    putCode: any,
    visibility: VisibilityStrings
  ): Observable<any> {
    return this._http
      .get(
        environment.API_WEB +
          'peer-reviews/' +
          putCode +
          '/visibility/' +
          visibility
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getPeerReviewGroups({ forceReload: true }))
      )
  }

  delete(putCode: string): Observable<any> {
    return this._http
      .delete(environment.API_WEB + 'peer-reviews/' + putCode, {
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
        environment.API_WEB +
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
