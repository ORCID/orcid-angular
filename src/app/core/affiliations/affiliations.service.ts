import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { AffiliationsGroupingService } from '../affiliations-grouping/affiliations-grouping.service'
import { AffiliationsSortService } from '../affiliations-sort/affiliations-sort.service'
import { AffiliationUIGroup, Affiliations } from 'src/app/types'
import { Observable, BehaviorSubject } from 'rxjs'
import { environment } from 'src/environments/environment'
import { retry, map, catchError, share, filter, first } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class AffiliationsService {
  affiliationsSubject = new BehaviorSubject<AffiliationUIGroup[]>(null)
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _affiliationsGroupingService: AffiliationsGroupingService,
    private _affiliationsSortService: AffiliationsSortService
  ) {}

  get(id): Observable<AffiliationUIGroup[]> {
    this._http
      .get<Affiliations>(environment.API_WEB + `${id}/affiliationGroups.json`)
      .pipe(
        retry(3),
        map(data => this._affiliationsGroupingService.transform(data)),
        map(data => this._affiliationsSortService.transform(data)),
        catchError(this._errorHandler.handleError)
      )
      .subscribe(data => this.affiliationsSubject.next(data))

    return this.affiliationsSubject
      .asObservable()
      .pipe(filter(data => data != null))
  }

  sort(value) {
    console.log('Subscribe')
    this.affiliationsSubject.pipe(first()).subscribe(data => {
      console.log('current value', data)
      const x = this._affiliationsSortService.transform(data, value)
      console.log('After sort ', x)
      this.affiliationsSubject.next(x)
    })

    return this.affiliationsSubject
      .asObservable()
      .pipe(filter(data => data != null))
  }
}
