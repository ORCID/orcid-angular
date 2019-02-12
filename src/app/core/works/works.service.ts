import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { Works, Work, ActivityService } from 'src/app/types'
import { retry, catchError, filter } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class WorksService implements ActivityService {
  workSubject = new BehaviorSubject<Works>(null)

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

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}
  /**
   * Return an observable with a list of Works with partial information.
   * For full work details getDetails(id, putCode) must be called
   *
   * This function might be a recall with different sort parameters
   * and that will update the same observable.
   *
   * @param id user Orcid id
   */
  sort(
    id: string,
    offset = 0,
    sort = 'date',
    sortAsc = false
  ): Observable<Works> {
    this.getWorksData(id, offset, sort, sortAsc).subscribe(data =>
      this.workSubject.next(data)
    )
    return this.workSubject.asObservable()
  }

  get(id) {
    this.getWorksData(id, 0, 'date', 'false').subscribe(data =>
      this.workSubject.next(data)
    )
    return this.workSubject.asObservable()
  }

  /**
   * TODO Make this function to return details data as part of workSubject
   *
   * Similar to get() witch to returns a list of Work objects
   * this returns a single Work object but adding the following attributes:
   *
   * citation, contributors, countryCode, countryName, createdDate, dateSortString, dateSortString
   * languageCode, languageName, url, lastModified, shortDescription, subtitle, workCategory
   *
   * TODO check why the userSource attribute comes as false on this call
   *
   * @param id user Orcid id
   */

  getDetails(id: string, putCode: string): Observable<Work> {
    return this._http
      .get<Work>(
        environment.API_WEB + `${id}/getWorkInfo.json?workId=${putCode}`
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
