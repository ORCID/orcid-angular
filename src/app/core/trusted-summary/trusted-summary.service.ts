import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { Observable, of } from 'rxjs'
import { TrustedSummary } from 'src/app/types/trust-summary'

import { catchError, retry, shareReplay, tap } from 'rxjs/operators'
import { ERROR_REPORT } from 'src/app/errors'

@Injectable({
  providedIn: 'root',
})
export class TrustedSummaryService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })

  private cache = new Map<string, Observable<TrustedSummary>>()

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getSummary(orcid: string): Observable<TrustedSummary> {
    if (!this.cache.has(orcid)) {
      const url = orcid + '/summary.json'
      const request$ = this._http
        .get<TrustedSummary>(runtimeEnvironment.BASE_URL + url, {
          headers: this.headers,
        })
        .pipe(
          retry(3),
          catchError((error) =>
            this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
          ),
          shareReplay(1) // Cache the result
        )
      this.cache.set(orcid, request$)
    }
    return this.cache.get(orcid)
  }

  clearCache(orcid?: string): void {
    if (orcid) {
      this.cache.delete(orcid)
    } else {
      this.cache.clear()
    }
  }
}
