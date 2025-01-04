import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { catchError, map, retry, tap } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { NamesEndPoint } from '../../types/record-name.endpoint'

import { UserRecordOptions } from 'src/app/types/record.local'
import { RecordPublicSideBarService } from '../record-public-side-bar/record-public-side-bar.service'

@Injectable({
  providedIn: 'root',
})
export class RecordNamesService {
  $names: ReplaySubject<NamesEndPoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _recordPublicSidebar: RecordPublicSideBarService
  ) {}

  getNames(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<NamesEndPoint> {
    if (options.publicRecordId) {
      return this._recordPublicSidebar
        .getPublicRecordSideBar(options)
        .pipe(map((value) => value.names))
    }
    if (!this.$names) {
      this.$names = new ReplaySubject<NamesEndPoint>(1)
    } else if (!options.forceReload) {
      return this.$names
    }
    if (options.cleanCacheIfExist && this.$names) {
      this.$names.next(<NamesEndPoint>undefined)
    }

    this._http
      .get<NamesEndPoint>(
        runtimeEnvironment.API_WEB + `account/nameForm.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        catchError(() => of({} as NamesEndPoint)),
        tap((value) => {
          this.$names.next(value)
        })
      )
      .subscribe()

    return this.$names
  }

  postNames(names: NamesEndPoint): Observable<NamesEndPoint> {
    return this._http
      .post<NamesEndPoint>(
        runtimeEnvironment.API_WEB + `account/nameForm.json`,
        names,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getNames({ forceReload: true }))
      )
  }
}
