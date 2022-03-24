import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/internal/Observable'
import { environment } from '../../../environments/environment.local'
import { QrCode, Status, TwoFactor, TwoFactorSetup } from '../../types/two-factor.endpoint'
import { catchError, retry } from 'rxjs/operators'
import { ERROR_REPORT } from '../../errors'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root'
})
export class TwoFactorAuthenticationService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
  ) { }

  checkState(): Observable<Status> {
    return this._http.get<Status>(
      environment.BASE_URL + '2FA/status.json'
    )
  }

  disable(): Observable<Status> {
    return this._http.post<Status>(
      environment.BASE_URL + '2FA/disable.json',
      { },
      { headers: this.headers }
    )
  }

  getTextCode(): Observable<{ secret: string }> {
    return this._http.get<{ secret: string }>(
      environment.BASE_URL + '2FA/secret.json'
    )
  }

  startSetup(): Observable<QrCode> {
    return this._http.get<QrCode>(
      environment.BASE_URL + '2FA/QRCode.json'
    )
  }

  register(obj): Observable<TwoFactorSetup> {
    return this._http.post<TwoFactorSetup>(
      environment.BASE_URL + '2FA/register.json',
      JSON.stringify(obj),
      { headers: this.headers }
    )
  }

  sendVerificationCode( obj ): Observable<TwoFactor> {
    return this._http.post<TwoFactor>(
      environment.BASE_URL + '2FA/QRCode.json',
      JSON.stringify(obj),
      { headers: this.headers }
    )
  }

  submitCode(twoFactor: TwoFactor, social?) {
    let url = 'shibboleth/2FA/submitCode.json'
    if (social) {
      url = 'social/2FA/submitCode.json'
    }
    return this._http
      .post<TwoFactor>(environment.BASE_URL + url, twoFactor, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  submitCodeForAnotherAccount(code: TwoFactor) {
    return this._http
      .post<TwoFactor>(environment.BASE_URL + `2FA/submitCode.json`, code, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }
}
