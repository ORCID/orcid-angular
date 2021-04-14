import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { WebsitesEndPoint } from '../../types/record-websites.endpoint'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { catchError, retry, tap } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { UserRecordOptions } from 'src/app/types/record.local'

@Injectable({
  providedIn: 'root',
})
export class RecordWebsitesService {
  $websites: ReplaySubject<WebsitesEndPoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getWebsites(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<WebsitesEndPoint> {
    //TODO GET PUBLIC DATA
    if (options.publicRecordId) {
      return of(undefined)
    }

    if (!this.$websites) {
      this.$websites = new ReplaySubject<WebsitesEndPoint>(1)
    } else if (!options.forceReload) {
      return this.$websites
    }

    this._http
      .get<WebsitesEndPoint>(
        environment.API_WEB + `my-orcid/websitesForms.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
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
        environment.API_WEB + `my-orcid/websitesForms.json`,
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
