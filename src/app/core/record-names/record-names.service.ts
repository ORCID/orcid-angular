import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { catchError, retry, tap } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { NamesEndPoint } from '../../types/record-name.endpoint'
import { environment } from '../../../environments/environment'
import { UserRecordOptions } from 'src/app/types/record.local'

@Injectable({
  providedIn: 'root',
})
export class RecordNamesService {
  $names: ReplaySubject<NamesEndPoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getNames(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<NamesEndPoint> {
    // TODO GET PUBLIC DATA
    if (options.publicRecordId) {
      return of(undefined)
    }

    if (!this.$names) {
      this.$names = new ReplaySubject<NamesEndPoint>(1)
    } else if (!options.forceReload) {
      return this.$names
    }

    this._http
      .get<NamesEndPoint>(environment.API_WEB + `account/nameForm.json`, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
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
        environment.API_WEB + `account/nameForm.json`,
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
