import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { WebsitesEndPoint } from '../../types/record-websites.endpoint'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { catchError, map, retry, tap } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { UserRecordOptions } from 'src/app/types/record.local'
import { RecordPublicSideBarService } from '../record-public-side-bar/record-public-side-bar.service'

@Injectable({
  providedIn: 'root',
})
export class RecordWebsitesService {
  $websites: ReplaySubject<WebsitesEndPoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _recordPublicSidebar: RecordPublicSideBarService
  ) {}

  getWebsites(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<WebsitesEndPoint> {
    if (options.publicRecordId) {
      return this._recordPublicSidebar
        .getPublicRecordSideBar(options)
        .pipe(map((value) => value.website))
    }
    if (!this.$websites) {
      this.$websites = new ReplaySubject<WebsitesEndPoint>(1)
    } else if (!options.forceReload) {
      return this.$websites
    }

    if (options.cleanCacheIfExist && this.$websites) {
      this.$websites.next(<WebsitesEndPoint>undefined)
    }

    this._http
      .get<WebsitesEndPoint>(
        runtimeEnvironment.API_WEB + `my-orcid/websitesForms.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        catchError(() => of({ websites: [] } as WebsitesEndPoint)),
        tap((value) => {
          this.$websites.next(value)
        })
      )
      .subscribe()
    return this.$websites
  }

  postWebsites(website: WebsitesEndPoint): Observable<WebsitesEndPoint> {
    return this._http
      .post<WebsitesEndPoint>(
        runtimeEnvironment.API_WEB + `my-orcid/websitesForms.json`,
        website,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getWebsites({ forceReload: true }))
      )
  }
}
