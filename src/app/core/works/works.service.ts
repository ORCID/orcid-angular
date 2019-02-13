import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs'
import { Works, Work, ActivityService } from 'src/app/types'
import {
  retry,
  catchError,
  filter,
  last,
  first,
  tap,
  map,
  mergeMap,
  startWith,
  switchMap,
} from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class WorksService implements ActivityService {
  lastEmitedValue: Works = null
  workSubject = new ReplaySubject<Works>(1)

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
    id: string,
    offset = 0,
    sort = 'date',
    sortAsc = false
  ): Observable<Works> {
    return this.getWorksData(id, offset, sort, sortAsc).pipe(
      map(data => {
        this.lastEmitedValue = data
        this.workSubject.next(data)
      }),
      switchMap(data => this.workSubject.asObservable())
    )
  }
  /**
   * Return an observable with a list of Works
   * For full work details getDetails(id, putCode) must be called
   *
   * @param id user Orcid id
   */
  get(id: string) {
    return this.getWorksData(id, 0, 'date', 'false').pipe(
      tap(data => {
        this.lastEmitedValue = data
        this.workSubject.next(data)
      }),
      switchMap(data => this.workSubject.asObservable())
    )
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

  getDetails(id: string, putCode: string) {
    return this.getWorkInfo(id, putCode).pipe(
      tap(workWithDetails => {
        this.lastEmitedValue.groups.map(works => {
          works.works = works.works.map(work => {
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

  private getWorkInfo(id: string, putCode: string): Observable<Work> {
    return this._http
      .get<Work>(
        environment.API_WEB + `${id}/getWorkInfo.json?workId=${putCode}`
      )
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }

  getWorksData(id: string, offset, sort, sortAsc): Observable<Works> {
    return this._http
      .get<Works>(
        environment.API_WEB +
          `${id}/worksPage.json?offset=${offset}&sort=${sort}&sortAsc=${sortAsc}`
      )
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }

  set(value: any): Observable<any> {
    throw new Error('Method not implemented.')
  }
  update(value: any): Observable<any> {
    throw new Error('Method not implemented.')
  }
}
