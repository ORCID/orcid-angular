import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { catchError, retry, switchMap, tap } from 'rxjs/operators'
import { Funding, FundingGroup } from 'src/app/types/record-funding.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { VisibilityStrings, Organization } from '../../types/common.endpoint'
import { RecordImportWizard } from '../../types/record-peer-review-import.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RecordFundingsService {
  lastEmittedValue: FundingGroup[]
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

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
          catchError(() => of([])),
          tap((data) => {
            this.lastEmittedValue = data
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
            this.lastEmittedValue = data
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

  updateVisibility(
    putCode: string,
    visibility: VisibilityStrings
  ): Observable<any> {
    return this._http
      .get(
        environment.API_WEB +
          'fundings/' +
          putCode +
          '/visibility/' +
          visibility
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getFundings({ forceReload: true }))
      )
  }

  delete(putCode: string): Observable<any> {
    return this._http
      .delete(
        environment.API_WEB +
          'fundings/funding.json?id=' +
          encodeURIComponent(putCode)
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getFundings({ forceReload: true }))
      )
  }

  getFunding(): Observable<Funding> {
    return this._http
      .get<Funding>(environment.API_WEB + `fundings/funding.json`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  save(funding: Funding) {
    return this._http
      .post<Funding>(environment.API_WEB + `fundings/funding.json`, funding)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getFundings({ forceReload: true }))
      )
  }

  getOrganization(org: string): Observable<Organization[]> {
    return this._http
      .get<Organization[]>(
        environment.API_WEB +
          'fundings/disambiguated/name/' +
          org +
          '?limit=100&funders-only=true',
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  loadFundingImportWizardList(): Observable<RecordImportWizard[]> {
    return this._http.get<RecordImportWizard[]>(
      environment.API_WEB + 'workspace/retrieve-funding-import-wizards.json'
    )
  }

  updatePreferredSource(putCode: string): Observable<any> {
    return this._http
      .get(
        environment.API_WEB + 'fundings/updateToMaxDisplay.json?putCode=' + putCode
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() =>
          this.getFundings({ forceReload: true })
        )
      )
  }
}
