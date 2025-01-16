import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { catchError, map, retry, tap } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'

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
    if (options.cleanCacheIfExist && this.$biography) {
      this.$biography.next(<BiographyEndPoint>undefined)
    }

    this._http
      .get<BiographyEndPoint>(
        runtimeEnvironment.API_WEB + `account/biographyForm.json`,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        catchError(() => of({} as BiographyEndPoint)),
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
        runtimeEnvironment.API_WEB + `account/biographyForm.json`,
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
