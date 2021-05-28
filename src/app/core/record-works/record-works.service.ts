import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { switchMap, retry, catchError, map, tap } from 'rxjs/operators'
import { Work, WorksEndpoint } from 'src/app/types/record-works.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class RecordWorksService {
  lastEmitedValue: WorksEndpoint = null
  workSubject = new ReplaySubject<WorksEndpoint>(1)
  offset = 0

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
        this.lastEmitedValue = data
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
  getWorks(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ) {
    if (options.publicRecordId) {
      return this._http
        .get<WorksEndpoint>(
          environment.API_WEB +
            options.publicRecordId +
            '/worksPage.json?offset=' +
            this.offset +
            '&sort=' +
            (options.sort != null ? options.sort : true) +
            '&sortAsc=' +
            (options.sortAsc != null ? options.sort : true) +
            `&pageSize=50`
        )
        .pipe(
          tap((data) => {
            this.lastEmitedValue = data
            this.workSubject.next(data)
          }),
          switchMap((data) => this.workSubject.asObservable())
        )
    } else {
      return this.getWorksData(0, 'date', 'false').pipe(
        tap((data) => {
          this.lastEmitedValue = data
          this.workSubject.next(data)
        }),
        switchMap((data) => this.workSubject.asObservable())
      )
    }
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
        this.lastEmitedValue.groups.map((works) => {
          works.works = works.works.map((work) => {
            if (work.putCode.value === putCode) {
              return workWithDetails
            }
            return work
          })
        })
        this.workSubject.next(this.lastEmitedValue)
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
  update(value: any): Observable<any> {
    throw new Error('Method not implemented.')
  }
}
