import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { AffiliationsGroupingService } from '../affiliations-grouping/affiliations-grouping.service'
import { AffiliationsSortService } from '../affiliations-sort/affiliations-sort.service'
import {
  AffiliationUIGroup,
  Affiliations,
  OrgDisambiguated,
  AffiliationsDetails,
} from 'src/app/types'
import { Observable, BehaviorSubject, ReplaySubject, of } from 'rxjs'
import { environment } from 'src/environments/environment'
import {
  retry,
  map,
  catchError,
  share,
  filter,
  first,
  tap,
  switchMap,
  combineLatest,
} from 'rxjs/operators'
import { ActivityService } from 'src/app/types/activities-service.local'

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

  private getAffiliations(id: string) {
    return this._http
      .get<Affiliations>(environment.API_WEB + `${id}/affiliationGroups.json`)
      .pipe(
        retry(3),
        map(data => this._affiliationsGroupingService.transform(data)),
        map(data => this._affiliationsSortService.transform(data)),
        catchError(this._errorHandler.handleError)
      )
  }

  getAffiliationDetails(id, type, value): Observable<AffiliationsDetails> {
    return this._http.get<AffiliationsDetails>(
      environment.API_WEB +
        `${id}/affiliationDetails.json?id=${value}&type=${type}`
    )
  }

  set(value): Observable<AffiliationUIGroup[]> {
    throw new Error('Method not implemented.')
  }
  update(value): Observable<AffiliationUIGroup[]> {
    throw new Error('Method not implemented.')
  }
}
