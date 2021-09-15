import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { catchError, map, retry, take, tap } from 'rxjs/operators'
import { UserRecordOptions } from 'src/app/types/record.local'

import { environment } from '../../../environments/environment'
import {
  ResearchResource,
  ResearchResourcesEndpoint,
} from '../../types/record-research-resources.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { VisibilityStrings } from '../../types/common.endpoint'
import { DEFAULT_PAGE_SIZE } from 'src/app/constants'

@Injectable({
  providedIn: 'root',
})
export class RecordResearchResourceService {
  $researchResourcesSubject: ReplaySubject<ResearchResourcesEndpoint>

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getResearchResourcePage(
    options: UserRecordOptions
  ): Observable<ResearchResourcesEndpoint> {
    options.pageSize = options.pageSize || DEFAULT_PAGE_SIZE
    options.offset = options.offset || 0

    if (options.publicRecordId) {
      return this._http
        .get<ResearchResourcesEndpoint>(
          environment.API_WEB +
            options.publicRecordId +
            '/researchResourcePage.json?offset=' +
            options.offset +
            '&sort=' +
            (options.sort != null ? options.sort : 'date') +
            '&sortAsc=' +
            (options.sortAsc != null ? options.sortAsc : false) +
            '&pageSize=' +
            options.pageSize
        )
        .pipe(
          catchError((error) => this._errorHandler.handleError(error)),
          catchError(() => of({ groups: [] } as ResearchResourcesEndpoint)),
          map((data) => {
            data.pageSize = options.pageSize
            data.pageIndex = options.offset
              ? Math.floor(options.offset / options.pageSize)
              : 0
            return data
          })
        )
    } else {
      if (!this.$researchResourcesSubject) {
        this.$researchResourcesSubject = new ReplaySubject<ResearchResourcesEndpoint>(
          1
        )
      } else if (!options.forceReload) {
        return this.$researchResourcesSubject
      }

      this._http
        .get<ResearchResourcesEndpoint>(
          environment.API_WEB +
            'research-resources/researchResourcePage.json?offset=' +
            options.offset +
            '&sort=' +
            (options.sort != null ? options.sort : 'date') +
            '&sortAsc=' +
            (options.sortAsc != null ? options.sortAsc : true) +
            '&pageSize=' +
            options.pageSize
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          catchError(() => of({ groups: [] } as ResearchResourcesEndpoint)),
          map((data) => {
            data.pageSize = options.pageSize
            data.pageIndex = options.offset
              ? Math.floor(options.offset / options.pageSize)
              : 0
            return data
          }),
          tap((value) => {
            this.$researchResourcesSubject.next(value)
          })
        )
        .subscribe()
    }
    return this.$researchResourcesSubject.asObservable()
  }

  changeUserRecordContext(
    event: UserRecordOptions
  ): Observable<ResearchResourcesEndpoint> {
    return this.getResearchResourcePage(event).pipe(take(1))
  }

  getResearchResourceById(putCode: string): Observable<ResearchResource> {
    return this._http.get<ResearchResource>(
      environment.API_WEB +
        'research-resources/researchResource.json?id=' +
        putCode
    )
  }

  getPublicResearchResourceById(orcid, putCode): Observable<ResearchResource> {
    return this._http.get<ResearchResource>(
      environment.API_WEB + orcid + '/researchResource.json?id=' + putCode
    )
  }

  updateVisibility(
    putCode: string,
    visibility: VisibilityStrings
  ): Observable<any> {
    return this._http
      .get(
        environment.API_WEB +
          'research-resources/' +
          putCode +
          '/visibility/' +
          visibility
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getResearchResourcePage({ forceReload: true }))
      )
  }

  delete(putCode: string): Observable<any> {
    return this._http
      .delete(environment.API_WEB + 'research-resources/' + putCode, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getResearchResourcePage({ forceReload: true }))
      )
  }
}
