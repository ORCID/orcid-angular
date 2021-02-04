import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { NamesEndPoint } from '../../types/record-name.endpoint'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class RecordNamesService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
  ) {
  }

  getNames(): Observable<NamesEndPoint> {
    return this._http
      .get<NamesEndPoint>(
        environment.API_WEB + `account/nameForm.json`,

        { headers: this.headers },
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
      )
  }

  postNames(names: NamesEndPoint): Observable<NamesEndPoint> {
    return this._http
      .post<NamesEndPoint>(environment.API_WEB + `account/nameForm.json`, names, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
      )
  }

}
