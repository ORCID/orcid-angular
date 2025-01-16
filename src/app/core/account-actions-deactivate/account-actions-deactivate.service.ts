import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'

export interface DeactivateResponse {
  email: string
}

@Injectable({
  providedIn: 'root',
})
export class AccountActionsDeactivateService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
  options: { headers: any; responseType: 'text' }

  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {
    this.options = { headers: this.headers, responseType: 'text' as 'text' }
  }

  deactivateAccount(): Observable<DeactivateResponse> {
    return this._http
      .post<DeactivateResponse>(
        runtimeEnvironment.API_WEB + `account/send-deactivate-account.json`,
        this.options
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
