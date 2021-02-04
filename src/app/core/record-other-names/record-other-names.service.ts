import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { OtherNamesEndPoint } from '../../types/record-other-names.endpoint'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RecordOtherNamesService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
  ) { }


  getOtherNames(): Observable<OtherNamesEndPoint> {
    return this._http
      .get<OtherNamesEndPoint>(environment.API_WEB + `my-orcid/otherNamesForms.json`, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  postOtherNames(otherNames: OtherNamesEndPoint): Observable<OtherNamesEndPoint> {
    return this._http
      .post<OtherNamesEndPoint>(
        environment.API_WEB + `my-orcid/otherNamesForms.json`,
        otherNames,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
