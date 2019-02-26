import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators'
import { Affiliations, Affiliation, AffiliationUIGroup } from 'src/app/types'
import { ActivityService } from 'src/app/types/activities-service.local'
import { environment } from 'src/environments/environment'

import { AffiliationsGroupingService } from '../affiliations-grouping/affiliations-grouping.service'
import { AffiliationsSortService } from '../affiliations-sort/affiliations-sort.service'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AffiliationsService implements ActivityService {
  affiliationsSubject = new ReplaySubject<AffiliationUIGroup[]>(1)
  lastEmitedValue: AffiliationUIGroup[]
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _affiliationsGroupingService: AffiliationsGroupingService,
    private _affiliationsSortService: AffiliationsSortService
  ) {}

  get(id: string): Observable<AffiliationUIGroup[]> {
    return this.getAffiliations(id).pipe(
      tap(data => {
        this.lastEmitedValue = data
        this.affiliationsSubject.next(data)
      }),
      switchMap(() => this.affiliationsSubject.asObservable())
    )
  }

  sort(value): Observable<AffiliationUIGroup[]> {
    const lastEmitedValue = this._affiliationsSortService.transform(
      this.lastEmitedValue,
      value
    )
    this.affiliationsSubject.next(lastEmitedValue)
    return this.affiliationsSubject.asObservable()
  }

  getAffiliationsDetails(id, type, putCode): Observable<AffiliationUIGroup[]> {
    return this.getAffiliationDetails(id, putCode, type).pipe(
      tap(data => {
        if (data && data.url && data.url.value) {
          this.lastEmitedValue.forEach(affiliations => {
            affiliations.affiliationGroup.map(affiliationsStack => {
              affiliationsStack.affiliations.map(affiliation => {
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
        this.affiliationsSubject.next(this.lastEmitedValue)
      }),
      switchMap(() => {
        return this.affiliationsSubject.asObservable()
      })
    )
  }

  private getAffiliationDetails(id, putCode, type): Observable<Affiliation> {
    return this._http
      .get<Affiliation>(
        environment.API_WEB +
          `${id}/affiliationDetails.json?id=${putCode}&type=${type}`
      )
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }

  private getAffiliations(id: string): Observable<AffiliationUIGroup[]> {
    return this._http
      .get<Affiliations>(environment.API_WEB + `${id}/affiliationGroups.json`)
      .pipe(
        retry(3),
        map(data => this._affiliationsGroupingService.transform(data)),
        map(data => this._affiliationsSortService.transform(data)),
        catchError(this._errorHandler.handleError)
      )
  }

  set(value): Observable<AffiliationUIGroup[]> {
    throw new Error('Method not implemented.')
  }
  update(value): Observable<AffiliationUIGroup[]> {
    throw new Error('Method not implemented.')
  }
}
