import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { OauthRequestInfo } from 'src/app/types'
import { environment } from 'src/environments/environment'
import { retry, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class OauthService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  public getRequestInfo() {
    return this._http
      .get<OauthRequestInfo | null>(
        environment.API_WEB +
          `oauth/custom/authorize/get_request_info_form.json`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
