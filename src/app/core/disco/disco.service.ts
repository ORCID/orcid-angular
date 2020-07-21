import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Institutional } from '../../types/institutional.endpoint'
import { catchError, retry } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class DiscoService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getDiscoFeed(): Observable<Institutional[]> {
    return this._http
      .get<Institutional[]>(environment.BASE_URL + 'Shibboleth.sso/DiscoFeed')
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
