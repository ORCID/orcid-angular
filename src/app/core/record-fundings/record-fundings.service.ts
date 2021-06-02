import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { cloneDeep } from 'lodash'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, retry, switchMap, tap } from 'rxjs/operators'
import { Funding, FundingGroup } from 'src/app/types/record-funding.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class RecordFundingsService {
  lastEmitedValue: FundingGroup[]

  $fundings: ReplaySubject<FundingGroup[]> = new ReplaySubject<FundingGroup[]>()

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getFundings(options: UserRecordOptions): Observable<FundingGroup[]> {
    if (options.publicRecordId) {
      this._http
        .get<FundingGroup[]>(
          environment.API_WEB +
            options.publicRecordId +
            '/fundingGroups.json?' +
            '&sort=' +
            (options.sort != null ? options.sort : 'date') +
            '&sortAsc=' +
            (options.sortAsc != null ? options.sortAsc : false)
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          tap((data) => {
            this.lastEmitedValue = data
            this.$fundings.next(data)
          }),
          switchMap((data) => this.$fundings.asObservable())
        )
        .subscribe()
    } else {
      this.getAndSortFundings(options)
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          tap((data) => {
            this.lastEmitedValue = data
            this.$fundings.next(data)
          }),
          switchMap((data) => this.$fundings.asObservable())
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

  changeUserRecordContext(userRecordContext: UserRecordOptions) {
    this.getFundings(userRecordContext).subscribe()
  }

  private getAndSortFundings(
    options: UserRecordOptions
  ): Observable<FundingGroup[]> {
    return this._http
      .get<FundingGroup[]>(
        environment.API_WEB +
          `fundings/fundingGroups.json?` +
          '/fundingGroups.json?' +
          '&sort=' +
          (options.sort != null ? options.sort : 'date') +
          '&sortAsc=' +
          (options.sortAsc != null ? options.sortAsc : false)
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
