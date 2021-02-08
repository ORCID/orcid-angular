import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { Biography, BiographyEndPoint } from '../../types/record-biography.endpoint'

@Injectable({
  providedIn: 'root'
})
export class RecordBiographyService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
  ) { }


  getBiography(): Observable<BiographyEndPoint> {
    return this._http
      .get<BiographyEndPoint>(
        environment.API_WEB + `account/biographyForm.json`,

        { headers: this.headers },
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
      )
  }

  postBiography(biography: BiographyEndPoint): Observable<BiographyEndPoint> {
    return this._http
      .post<BiographyEndPoint>(
        environment.API_WEB + `account/biographyForm.json`,
        biography,
        { headers: this.headers },
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
      )
  }
}
