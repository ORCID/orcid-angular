import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { cloneDeep } from 'lodash'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, retry, tap } from 'rxjs/operators'
import { Funding, FundingGroup } from 'src/app/types/record-funding.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class RecordFundingsService {
  fundingsSubject = new ReplaySubject<FundingGroup[]>(1)
  lastEmitedValue: FundingGroup[]

  $fundings: ReplaySubject<FundingGroup[]>

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getFundings(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<FundingGroup[]> {
    if (options.publicRecordId) {
      return this._http.get<FundingGroup[]>(
        environment.API_WEB +
          options.publicRecordId +
          '/fundingGroups.json?sort=date&sortAsc=' +
          (options.sortAsc != null ? options.sortAsc : false)
      )
    }

    if (!this.$fundings) {
      this.$fundings = new ReplaySubject(1)
      this.getAndSortFundings()
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          tap((value) => {
            this.lastEmitedValue = cloneDeep(value)
            this.$fundings.next(value)
          })
        )
        .subscribe()
    }
    return this.$fundings.asObservable()
  }

  getFundingDetails(putCode): Observable<Funding> {
    return this._http
      .get<Funding>(
        environment.API_WEB + `fundings/fundingDetails.json?id=${putCode}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
    /* TODO: Fetch group id info */
  }

  getPublicFundingDetails(orcid, putCode): Observable<any> {
    return this._http
      .get<Funding>(
        environment.API_WEB + orcid + `/fundingDetails.json?id=${putCode}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  private getAndSortFundings(): Observable<FundingGroup[]> {
    return this._http
      .get<FundingGroup[]>(
        environment.API_WEB +
          `fundings/fundingGroups.json?sort=date&sortAsc=false`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  set(value): Observable<FundingGroup[]> {
    throw new Error('Method not implemented.')
  }
  update(value): Observable<FundingGroup[]> {
    throw new Error('Method not implemented.')
  }
}
