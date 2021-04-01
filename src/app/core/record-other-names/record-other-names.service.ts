import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, retry, tap } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { OtherNamesEndPoint } from '../../types/record-other-names.endpoint'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class RecordOtherNamesService {
  $otherNames: ReplaySubject<OtherNamesEndPoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getOtherNames(forceReload = false): Observable<OtherNamesEndPoint> {
    if (!this.$otherNames) {
      this.$otherNames = new ReplaySubject<OtherNamesEndPoint>(1)
    } else if (!forceReload) {
      return this.$otherNames
    }

    this._http
      .get<OtherNamesEndPoint>(
        environment.API_WEB + `my-orcid/otherNamesForms.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
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
        environment.API_WEB + `my-orcid/otherNamesForms.json`,
        otherNames,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getOtherNames(true))
      )
  }
}
