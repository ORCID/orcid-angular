import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RequestInfoForm } from '../../types/request-info-form.endpoint'
import { catchError, retry } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class OauthService {
  private headers: HttpHeaders

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    })
  }

  loadRequestInfoForm(): Observable<RequestInfoForm> {
    return this._http
      .get<RequestInfoForm>(
        environment.BASE_URL +
          'oauth/custom/authorize/get_request_info_form.json',
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
