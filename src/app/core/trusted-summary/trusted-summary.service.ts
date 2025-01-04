import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { Observable } from 'rxjs'
import { TrustedSummary } from 'src/app/types/trust-summary'
import { environment } from 'src/environments/environment'
import { catchError, retry } from 'rxjs/operators'
import { ERROR_REPORT } from 'src/app/errors'

@Injectable({
  providedIn: 'root',
})
export class TrustedSummaryService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getSummary(orcid): Observable<TrustedSummary> {
    let url = orcid + '/summary.json'
    return this._http
      .get<TrustedSummary>(runtimeEnvironment.BASE_URL + url, {
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
