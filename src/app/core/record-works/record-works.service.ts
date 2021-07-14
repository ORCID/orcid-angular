import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, map, retry, switchMap, take, tap } from 'rxjs/operators'
import { Work, WorksEndpoint } from 'src/app/types/record-works.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { VisibilityStrings } from '../../types/common.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RecordWorksService {
  lastEmittedValue: WorksEndpoint = null
  workSubject = new ReplaySubject<WorksEndpoint>(1)
  offset = 0

  $works: ReplaySubject<WorksEndpoint>

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  /**
   * Return an observable with a list of Works
   * Arrange according to the requested parameters
   *
   * @param id user Orcid id
   */

  sort(
    offset = 0,
    sort = 'date',
    sortAsc = false,
    orcidId?: string
  ): Observable<WorksEndpoint> {
    return this.getWorksData(offset, sort, sortAsc, orcidId).pipe(
      map((data) => {
        this.lastEmittedValue = data
        this.workSubject.next(data)
      }),
      switchMap((data) => this.workSubject.asObservable())
    )
  }
  /**
   * Return an observable with a list of Works
   * For full work details getDetails(id, putCode) must be called
   *
   * @param id user Orcid id
   */
  getWorks(options: UserRecordOptions) {
    options.pageSize = options.pageSize || 50
    options.offset = options.offset || 0

    if (options.publicRecordId) {
      return this._http
        .get<WorksEndpoint>(
          environment.API_WEB +
            options.publicRecordId +
            '/worksPage.json?offset=' +
            options.offset +
            '&sort=' +
            (options.sort != null ? options.sort : 'date') +
            '&sortAsc=' +
            (options.sortAsc != null ? options.sortAsc : false) +
            `&pageSize=` +
            options.pageSize
        )

        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          map((data) => {
            data.pageSize = options.pageSize
            data.pageIndex = options.offset
              ? Math.floor(options.offset / options.pageSize)
              : 0
            return data
          }),
          tap((data) => {
            this.lastEmittedValue = data
            this.workSubject.next(data)
          }),
          switchMap((data) => this.workSubject.asObservable())
        )
    } else {
      if (!this.$works) {
        this.$works = new ReplaySubject(1)
      } else if (!options.forceReload) {
        return this.$works
      }

      this._http
        .get<WorksEndpoint>(
          environment.API_WEB +
            'works/worksPage.json?offset=' +
            options.offset +
            '&sort=' +
            (options.sort != null ? options.sort : 'date') +
            '&sortAsc=' +
            (options.sortAsc != null ? options.sortAsc : true) +
            `&pageSize=` +
            options.pageSize
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          map((data) => {
            data.pageSize = options.pageSize
            data.pageIndex = options.offset
              ? Math.floor(options.offset / options.pageSize)
              : 0
            return data
          }),
          tap((data) => {
            this.lastEmittedValue = data
            this.$works.next(data)
          })
        )
        .subscribe()

      return this.$works.asObservable()
    }
  }

  changeUserRecordContext(event: UserRecordOptions): void {
    this.getWorks(event).pipe(take(1)).subscribe()
  }

  /**
   * Similar to get() witch to returns a list of Work objects
   * this returns the same observable list but with the details of the requested work.
   *
   * This would add the following data to the Work:
   * citation, contributors, countryCode, countryName, createdDate, dateSortString, dateSortString
   * languageCode, languageName, url, lastModified, shortDescription, subtitle, workCategory
   *
   * TODO check why the userSource attribute comes as false on this call
   *
   * @param id user Orcid id
   * @param putCode code of work
   */

  getDetails(putCode: string, orcidId?: string): Observable<WorksEndpoint> {
    return this.getWorkInfo(putCode, orcidId).pipe(
      tap((workWithDetails) => {
        this.lastEmittedValue.groups.map((works) => {
          works.works = works.works.map((work) => {
            if (work.putCode.value === putCode) {
              return workWithDetails
            }
            return work
          })
        })
        this.workSubject.next(this.lastEmittedValue)
      }),
      switchMap(() => {
        return this.workSubject.asObservable()
      })
    )
  }

  private getWorkInfo(putCode: string, orcidId?: string): Observable<Work> {
    return this._http
      .get<Work>(
        environment.API_WEB +
          `${
            orcidId ? orcidId + '/' : 'works/'
          }getWorkInfo.json?workId=${putCode}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getWorksData(
    offset,
    sort,
    sortAsc,
    orcidId?: string
  ): Observable<WorksEndpoint> {
    return this._http
      .get<WorksEndpoint>(
        environment.API_WEB +
          `${
            orcidId ? orcidId + '/' : 'works/'
          }worksPage.json?offset=${offset}&sort=${sort}&sortAsc=${sortAsc}&pageSize=50`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  set(value: any): Observable<any> {
    throw new Error('Method not implemented.')
  }

  updateVisibility(putCode: string, visibility: VisibilityStrings): Observable<any> {
    return this._http
      .get(
        environment.API_WEB + 'works/' + putCode + '/visibility/' + visibility,
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getWorks({ forceReload: true })),
      )
  }

  delete(putCode: string): Observable<any> {
    return this._http.delete(environment.API_WEB + 'works/' + putCode).pipe(
      retry(3),
      catchError((error) => this._errorHandler.handleError(error)),
      tap(() => this.getWorks({ forceReload: true }))
    )
  }
}
