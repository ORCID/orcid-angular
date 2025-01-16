import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { PasswordRecovery } from 'src/app/types'
import { environment } from 'src/environments/environment'
import { retry, catchError } from 'rxjs/operators'
import { ERROR_REPORT } from 'src/app/errors'
import {
  ResetPasswordEmailForm,
  ResetPasswordEmailFormValidate,
} from 'src/app/types/reset-password.endpoint'

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
  })

  resetPassword(data) {
    return this._http
      .post<PasswordRecovery>(
        runtimeEnvironment.API_WEB + `reset-password.json`,
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
      .post<PasswordRecovery>(
        runtimeEnvironment.API_WEB + `forgot-id.json`,
        data,
        {
          withCredentials: true,
        }
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

  resetPasswordEmail(resetPassword: ResetPasswordEmailForm) {
    let encodedData = JSON.stringify(resetPassword)
    return this._http
      .post<ResetPasswordEmailForm>(
        runtimeEnvironment.API_WEB + `reset-password-email-v2.json`,
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
  resetPasswordEmailValidateToken(
    resetPassword: ResetPasswordEmailFormValidate
  ) {
    let encodedData = JSON.stringify(resetPassword)
    return this._http
      .post<ResetPasswordEmailForm>(
        runtimeEnvironment.API_WEB + `reset-password-email-validate-token.json`,
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
