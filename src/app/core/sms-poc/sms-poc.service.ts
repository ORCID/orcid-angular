import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import {
  SmsPocRequest,
  SmsPocResponse,
  SmsVerificationCheckRequest,
} from 'src/app/types/sms-poc.endpoint'

@Injectable({
  providedIn: 'root',
})
export class SmsPocService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  send(data: SmsPocRequest) {
    return this._http
      .post<SmsPocResponse>(
        runtimeEnvironment.API_WEB + 'sms-poc/send.json',
        data,
        {
          withCredentials: true,
        }
      )
      .pipe(catchError((error) => this._errorHandler.handleError(error)))
  }

  verify(data: SmsVerificationCheckRequest) {
    return this._http
      .post<SmsPocResponse>(
        runtimeEnvironment.API_WEB + 'sms-poc/verify.json',
        data,
        {
          withCredentials: true,
        }
      )
      .pipe(catchError((error) => this._errorHandler.handleError(error)))
  }
}
