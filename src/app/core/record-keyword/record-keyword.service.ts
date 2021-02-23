import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, retry, tap } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { KeywordEndPoint } from '../../types/record-keyword.endpoint'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class RecordKeywordService {
  $keywords: ReplaySubject<KeywordEndPoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getKeywords(forceReload = false): Observable<KeywordEndPoint> {
    console.log("getKeywords")
    console.log("forceReload? " + forceReload)
    if (!this.$keywords) {
      this.$keywords = new ReplaySubject<KeywordEndPoint>(1)
    } else if (!forceReload) {
      return this.$keywords
    }

    this._http
      .get<KeywordEndPoint>(
        environment.API_WEB + `my-orcid/keywordsForms.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap((value) => {
          console.log(value)
          this.$keywords.next(value)
        })
      )
      .subscribe()

    return this.$keywords
  }

  postKeywords(
    keywords: KeywordEndPoint
  ): Observable<KeywordEndPoint> {
    return this._http
      .post<KeywordEndPoint>(
        environment.API_WEB + `my-orcid/keywordsForms.json`,
        keywords,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getKeywords(true))
      )
  }
}
