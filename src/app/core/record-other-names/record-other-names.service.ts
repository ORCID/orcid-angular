import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, ReplaySubject } from 'rxjs'
import { catchError, map, retry, tap } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { OtherNamesEndPoint } from '../../types/record-other-names.endpoint'

import { UserRecordOptions } from 'src/app/types/record.local'
import { RecordPublicSideBarService } from '../record-public-side-bar/record-public-side-bar.service'
import { flatMap, groupBy } from 'lodash'

@Injectable({
  providedIn: 'root',
})
export class RecordOtherNamesService {
  $otherNames: ReplaySubject<OtherNamesEndPoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _recordPublicSidebar: RecordPublicSideBarService
  ) {}

  getOtherNames(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<OtherNamesEndPoint> {
    if (options.publicRecordId) {
      return this._recordPublicSidebar.getPublicRecordSideBar(options).pipe(
        map((value) => value?.otherNames),
        map((value) => {
          if (value?.otherNames) {
            value.otherNames = flatMap(
              groupBy(value?.otherNames, (item) =>
                item?.content.toLowerCase().trim()
              )
            )
          }
          return value
        })
      )
    }
    if (!this.$otherNames) {
      this.$otherNames = new ReplaySubject<OtherNamesEndPoint>(1)
    } else if (!options.forceReload) {
      return this.$otherNames
    } else if (options.cleanCacheIfExist && this.$otherNames) {
      this.$otherNames.next(<OtherNamesEndPoint>undefined)
    }

    this._http
      .get<OtherNamesEndPoint>(
        runtimeEnvironment.API_WEB + `my-orcid/otherNamesForms.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        catchError(() => of({ otherNames: [] } as OtherNamesEndPoint)),
        tap((value) => {
          this.$otherNames.next(value)
        })
      )
      .subscribe()

    return this.$otherNames
  }

  postOtherNames(
    otherNames: OtherNamesEndPoint
  ): Observable<OtherNamesEndPoint> {
    return this._http
      .post<OtherNamesEndPoint>(
        runtimeEnvironment.API_WEB + `my-orcid/otherNamesForms.json`,
        otherNames,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getOtherNames({ forceReload: true }))
      )
  }
}
