import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { VisibilityStrings } from 'src/app/types/common.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountDefaultVisibilityService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })

  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {}

  update(frequency: VisibilityStrings): Observable<void> {
    return this._http
      .post<void>(
        runtimeEnvironment.API_WEB + `account/default_visibility.json`,
        frequency,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
