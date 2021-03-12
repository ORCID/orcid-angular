import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators'
import {
  AffiliationUIGroup,
  AffiliationsEndpoint,
  Affiliation,
} from 'src/app/types/record-affiliation.endpoint'
import { environment } from 'src/environments/environment'

import { AffiliationsSortService } from '../record-affiliations-sort/record-affiliations-sort.service'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RecordAffiliationsGroupingService } from '../record-affiliations-affiliations-grouping/record-affiliations-grouping.service'
import { cloneDeep } from 'lodash'

@Injectable({
  providedIn: 'root',
})
export class RecordAffiliationService {
  affiliationsSubject = new ReplaySubject<AffiliationUIGroup[]>(1)
  lastEmitedValue: AffiliationUIGroup[]

  $affiliations: ReplaySubject<AffiliationUIGroup[]>

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _affiliationsGroupingService: RecordAffiliationsGroupingService,
    private _affiliationsSortService: AffiliationsSortService
  ) {}

  getAffiliations(): Observable<AffiliationUIGroup[]> {
    if (!this.$affiliations) {
      this.$affiliations = new ReplaySubject(1)
      this.getGroupAndSortAffiliations()
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          tap((value) => {
            this.lastEmitedValue = cloneDeep(value)
            this.$affiliations.next(value)
          })
        )
        .subscribe()
    }
    return this.$affiliations.asObservable()
  }

  // Getting the "affiliations details" seems like a waste of network resources.
  // This will only return a url which on the first call comes as null.
  getAffiliationsDetails(type, putCode): Observable<AffiliationUIGroup[]> {
    return this.getAffiliationDetails(putCode, type).pipe(
      tap((data) => {
        if (data && data.url && data.url.value) {
          this.lastEmitedValue.forEach((affiliations) => {
            affiliations.affiliationGroup.map((affiliationsStack) => {
              affiliationsStack.affiliations.map((affiliation) => {
                if (
                  affiliation.affiliationType.value === type &&
                  affiliation.putCode.value === putCode
                ) {
                  affiliation.url.value = data.url.value
                }
              })
            })
          })
        }
        this.$affiliations.next(this.lastEmitedValue)
      }),
      switchMap(() => {
        return this.$affiliations.asObservable()
      })
    )
  }

  private getAffiliationDetails(putCode, type): Observable<Affiliation> {
    return this._http
      .get<Affiliation>(
        environment.API_WEB +
          `affiliations/affiliationDetails.json?id=${putCode}&type=${type}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  private getGroupAndSortAffiliations(): Observable<AffiliationUIGroup[]> {
    return this._http
      .get<AffiliationsEndpoint>(
        environment.API_WEB + `affiliations/affiliationGroups.json`
      )
      .pipe(
        retry(3),
        map((data) => this._affiliationsGroupingService.transform(data)),
        map((data) => this._affiliationsSortService.transform(data)),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  set(value): Observable<AffiliationUIGroup[]> {
    throw new Error('Method not implemented.')
  }
  update(value): Observable<AffiliationUIGroup[]> {
    throw new Error('Method not implemented.')
  }
}
