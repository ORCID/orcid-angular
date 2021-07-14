import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators'
import {
  AffiliationUIGroup,
  AffiliationsEndpoint,
  Affiliation,
  Organization,
} from 'src/app/types/record-affiliation.endpoint'
import { environment } from 'src/environments/environment'

import { AffiliationsSortService } from '../record-affiliations-sort/record-affiliations-sort.service'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RecordAffiliationsGroupingService } from '../record-affiliations-affiliations-grouping/record-affiliations-grouping.service'
import { cloneDeep } from 'lodash'
import { UserRecordOptions } from 'src/app/types/record.local'
import { VisibilityStrings } from '../../types/common.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RecordAffiliationService {
  affiliationsSubject = new ReplaySubject<AffiliationUIGroup[]>(1)
  lastEmittedValue: AffiliationUIGroup[]
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  $affiliations: ReplaySubject<AffiliationUIGroup[]>

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _affiliationsGroupingService: RecordAffiliationsGroupingService,
    private _affiliationsSortService: AffiliationsSortService
  ) {}

  getAffiliations(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<AffiliationUIGroup[]> {
    if (!this.$affiliations) {
      this.$affiliations = new ReplaySubject(1)
    } else if (!options.forceReload) {
      return this.$affiliations
    }

    this.getGroupAndSortAffiliations(options)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap((value) => {
          this.lastEmittedValue = cloneDeep(value)
          this.$affiliations.next(value)
        })
      )
      .subscribe()

    return this.$affiliations.asObservable()
  }

  // Getting the "affiliations details" seems like a waste of network resources.
  // This will only return a url which on the first call comes as null.
  getAffiliationsDetails(
    type,
    putCode,
    options?: UserRecordOptions
  ): Observable<AffiliationUIGroup[]> {
    return this.getAffiliationDetails(putCode, type, options).pipe(
      tap((data) => {
        if (data && data.url && data.url.value) {
          this.lastEmittedValue.forEach((affiliations) => {
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
        this.$affiliations.next(this.lastEmittedValue)
      }),
      switchMap(() => {
        return this.$affiliations.asObservable()
      })
    )
  }

  private getAffiliationDetails(
    putCode,
    type,
    options?: UserRecordOptions
  ): Observable<Affiliation> {
    return this._http
      .get<Affiliation>(
        environment.API_WEB +
          `${
            options?.publicRecordId
              ? options?.publicRecordId + '/'
              : 'affiliations/'
          }affiliationDetails.json?id=${putCode}&type=${type}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  private getGroupAndSortAffiliations(
    options: UserRecordOptions
  ): Observable<AffiliationUIGroup[]> {
    if (options.publicRecordId) {
      return this._http
        .get<AffiliationsEndpoint>(
          environment.API_WEB +
            `${options.publicRecordId}/affiliationGroups.json`
        )
        .pipe(
          retry(3),
          map((data) => this._affiliationsGroupingService.transform(data)),
          map((data) => this._affiliationsSortService.transform(data)),
          catchError((error) => this._errorHandler.handleError(error))
        )
    } else {
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
  }

  changeUserRecordContext(userRecordContext: UserRecordOptions, type: string) {
    const value = this._affiliationsSortService.transform(
      this.lastEmittedValue,
      userRecordContext,
      type
    )
    this.lastEmittedValue = cloneDeep(value)
    this.$affiliations.next(value)
  }

  postAffiliation(affiliation): Observable<Affiliation> {
    return this._http
      .post<Affiliation>(
        environment.API_WEB + 'affiliations/affiliation.json',
        affiliation,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getAffiliations({ forceReload: true }))
      )
  }

  getOrganization(org: string): Observable<Organization[]> {
    return this._http
      .get<Organization[]>(
        environment.API_WEB +
          'affiliations/disambiguated/name/' +
          org +
          '?limit=100',
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  updateVisibility(
    putCode: string,
    visibility: VisibilityStrings
  ): Observable<any> {
    return this._http
      .get(
        environment.API_WEB +
          'affiliations/' +
          putCode +
          '/visibility/' +
          visibility
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getAffiliations({ forceReload: true }))
      )
  }

  delete(putCode: string): Observable<any> {
    return this._http
      .delete(
        environment.API_WEB +
          'affiliations/affiliation.json' +
          '?id=' +
          encodeURIComponent(putCode)
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getAffiliations({ forceReload: true }))
      )
  }
}
