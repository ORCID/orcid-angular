import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { Observable, ReplaySubject } from 'rxjs'
import { environment } from '../../../environments/environment'
import {
  ResearchResource,
  ResearchResourcesEndpoint,
} from '../../types/record-research-resources.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { first, map, tap } from 'rxjs/operators'

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

    if (options.forceReload) {
      this.$RecordResearchResourceSubject = null
      this.lastOffset = 0
      this.currentValue = null
    }

    if (this.$RecordResearchResourceSubject) {
      if (!(options.offset > this.lastOffset)) {
        return this.$RecordResearchResourceSubject.asObservable()
      }
    } else {
      this.$RecordResearchResourceSubject = new ReplaySubject<ResearchResourcesEndpoint>(
        1
      )
    }

    if (options.publicRecordId) {
      this._http
        .get<ResearchResourcesEndpoint>(
          environment.API_WEB +
            options.publicRecordId +
            '/researchResourcePage.json?offset=' +
            options.offset +
            '&sort=' +
            (options.sort != null ? options.sort : true) +
            '&sortAsc=' +
            (options.sortAsc != null ? options.sort : true)
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
    } else {
      this._http
        .get<ResearchResourcesEndpoint>(
          environment.API_WEB +
            'research-resources/researchResourcePage.json?offset=' +
            options.offset +
            '&sort=' +
            (options.sort != null ? options.sort : true) +
            '&sortAsc=' +
            (options.sortAsc != null ? options.sort : true)
        )
        .pipe(
          tap((value) => {
            this.$RecordResearchResourceSubject.next(value)
          }),
          first()
        )
        .subscribe()
    }
    return this.$RecordResearchResourceSubject.asObservable()
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
}
