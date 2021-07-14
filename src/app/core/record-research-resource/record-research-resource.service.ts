import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, first, map, retry, tap } from 'rxjs/operators'
import { UserRecordOptions } from 'src/app/types/record.local'

import { environment } from '../../../environments/environment'
import {
  ResearchResource,
  ResearchResourcesEndpoint,
} from '../../types/record-research-resources.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { VisibilityStrings } from '../../types/common.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RecordResearchResourceService {
  private $RecordResearchResourceSubject: ReplaySubject<ResearchResourcesEndpoint>
  private currentValue: ResearchResourcesEndpoint

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })
  lastOffset = 0

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getResearchResourcePage(
    options: UserRecordOptions
  ): Observable<ResearchResourcesEndpoint> {
    options.offset = options.offset || 0

    if (
      this.$RecordResearchResourceSubject &&
      !options.forceReload &&
      !(options.offset > this.lastOffset)
    ) {
      return this.$RecordResearchResourceSubject.asObservable()
    }

    if (!this.$RecordResearchResourceSubject) {
      this.$RecordResearchResourceSubject = new ReplaySubject<ResearchResourcesEndpoint>(
        1
      )
    }

    if (options.forceReload) {
      this.lastOffset = 0
      this.currentValue = null
    }

    if (options.publicRecordId) {
      this._http
        .get<ResearchResourcesEndpoint>(
          environment.API_WEB +
            options.publicRecordId +
            '/researchResourcePage.json?offset=' +
            options.offset +
            '&sort=' +
            (options.sort != null ? options.sort : 'date') +
            '&sortAsc=' +
            (options.sortAsc != null ? options.sortAsc : false)
        )
        .pipe(
          map((value) => {
            if (this.currentValue && !options.forceReload) {
              value.groups = value.groups.concat(this.currentValue.groups)
            }
            this.currentValue = value
            value.offset = options.offset
            return value
          }),
          tap((value) => {
            this.$RecordResearchResourceSubject.next(value)
          }),
          first()
        )
        .subscribe()
    } else {
      this._http
        .get<ResearchResourcesEndpoint>(
          environment.API_WEB +
            'research-resources/researchResourcePage.json?offset=' +
            options.offset +
            '&sort=' +
            (options.sort != null ? options.sort : 'date') +
            '&sortAsc=' +
            (options.sortAsc != null ? options.sortAsc : true)
        )
        .pipe(
          map((value) => {
            if (this.currentValue) {
              value.groups = value.groups.concat(this.currentValue.groups)
            }
            this.currentValue = value
            value.offset = options.offset
            return value
          }),
          tap((value) => {
            this.$RecordResearchResourceSubject.next(value)
          }),
          first()
        )
        .subscribe()
    }
    return this.$RecordResearchResourceSubject.asObservable()
  }

  changeUserRecordContext(event: UserRecordOptions): void {
    this.getResearchResourcePage(event)
  }

  loadMore(offset: number, publicRecordId?: string) {
    this.getResearchResourcePage({
      offset,
      publicRecordId,
    })
  }

  getResearchResourceById(putCode: number): Observable<ResearchResource> {
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
