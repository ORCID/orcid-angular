import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { AccountDefaultEmailFrequenciesEndpoint } from 'src/app/types/account-default-visibility.endpoint'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountDefaultEmailFrequenciesService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {}

  get(): Observable<AccountDefaultEmailFrequenciesEndpoint> {
    return this._http
      .get<AccountDefaultEmailFrequenciesEndpoint>(
        runtimeEnvironment.API_WEB + `notifications/frequencies/view`,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  updateAmendNotifications(frequency: number): Observable<void> {
    return this._http
      .post<void>(
        runtimeEnvironment.API_WEB +
          `notifications/frequencies/update/amendUpdates`,
        frequency,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
  updateAdminNotifications(frequency: string): Observable<void> {
    return this._http
      .post<void>(
        runtimeEnvironment.API_WEB +
          `notifications/frequencies/update/adminUpdates`,
        frequency,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
  updateMemberNotifications(frequency: string): Observable<void> {
    return this._http
      .post<void>(
        runtimeEnvironment.API_WEB +
          `notifications/frequencies/update/memberUpdates`,
        frequency,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  updateMemberTipsUpdates(tips: boolean): Observable<void> {
    return this._http
      .post<void>(
        runtimeEnvironment.API_WEB +
          `notifications/frequencies/update/tipsUpdates`,
        tips,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
