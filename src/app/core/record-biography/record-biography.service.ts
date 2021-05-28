import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, map, retry, tap } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { BiographyEndPoint } from '../../types/record-biography.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { RecordPublicSideBarService } from '../record-public-side-bar/record-public-side-bar.service'

@Injectable({
  providedIn: 'root',
})
export class RecordBiographyService {
  $biography: ReplaySubject<BiographyEndPoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _recordPublicSidebar: RecordPublicSideBarService
  ) {}

  getBiography(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<BiographyEndPoint> {
    if (options.publicRecordId) {
      return this._recordPublicSidebar
        .getPublicRecordSideBar(options)
        .pipe(map((value) => value.biography))
    }

    if (!this.$biography) {
      this.$biography = new ReplaySubject<BiographyEndPoint>(1)
    } else if (!options.forceReload) {
      return this.$biography
    }

    this._http
      .get<BiographyEndPoint>(
        environment.API_WEB + `account/biographyForm.json`,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap((value) => {
          this.$biography.next(value)
        })
      )
      .subscribe()
    return this.$biography
  }

  postBiography(biography: BiographyEndPoint): Observable<BiographyEndPoint> {
    return this._http
      .post<BiographyEndPoint>(
        environment.API_WEB + `account/biographyForm.json`,
        biography,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getBiography({ forceReload: true }))
      )
  }
}
