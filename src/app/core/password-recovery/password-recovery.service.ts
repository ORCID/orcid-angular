import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { PasswordRecovery } from 'src/app/types'
import { environment } from 'src/environments/environment'
import { retry, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class PasswordRecoveryService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  resetPassword(data) {
    return this._http
      .post<PasswordRecovery>(
        environment.API_WEB + `reset-password.json`,
        data,
        { withCredentials: true }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  remindOrcidId(data) {
    return this._http
      .post<PasswordRecovery>(environment.API_WEB + `forgot-id.json`, data, {
        withCredentials: true,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
