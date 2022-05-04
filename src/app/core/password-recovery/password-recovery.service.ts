import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { PasswordRecovery } from 'src/app/types'
import { environment } from 'src/environments/environment'
import { retry, catchError } from 'rxjs/operators'
import { ERROR_REPORT } from 'src/app/errors'
import { ResetPasswordEmailForm } from 'src/app/types/reset-password.endpoint'

@Injectable({
  providedIn: 'root',
})
export class PasswordRecoveryService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  resetPassword(data) {
    return this._http
      .post<PasswordRecovery>(
        environment.API_WEB + `reset-password.json`,
        data,
        { withCredentials: true }
      )
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(
            error,
            ERROR_REPORT.RESET_PASSWORD_COULD_NOT_RECOVER
          )
        )
      )
  }

  remindOrcidId(data) {
    return this._http
      .post<PasswordRecovery>(environment.API_WEB + `forgot-id.json`, data, {
        withCredentials: true,
      })
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(
            error,
            ERROR_REPORT.RESET_PASSWORD_COULD_NOT_RECOVER
          )
        )
      )
  }

  resetPasswordEmail(resetPassword: ResetPasswordEmailForm) {
    console.log('resetPasswordEmail');
    let encodedData = JSON.stringify(resetPassword);

    console.log(encodedData);
    
    return this._http
      .post<ResetPasswordEmailForm>(
        environment.API_WEB + `reset-password-email-v2.json`,
        encodedData,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
