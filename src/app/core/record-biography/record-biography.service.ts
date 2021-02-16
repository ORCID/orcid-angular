import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, retry, tap } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { BiographyEndPoint } from '../../types/record-biography.endpoint'

@Injectable({
  providedIn: 'root'
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
  ) { }


  getBiography(forceReload = false): Observable<BiographyEndPoint> {
    if (!this.$biography) {
      this.$biography = new ReplaySubject<BiographyEndPoint>(1)
    } else if (!forceReload) {
      return this.$biography
    }

    this._http
      .get<BiographyEndPoint>(
        environment.API_WEB + `account/biographyForm.json`,
        { headers: this.headers },
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
        { headers: this.headers },
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getBiography(true))
      )
  }
}
