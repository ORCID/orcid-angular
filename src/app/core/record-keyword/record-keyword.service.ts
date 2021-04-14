import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, ReplaySubject } from 'rxjs'
import { catchError, retry, tap } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { KeywordEndPoint } from '../../types/record-keyword.endpoint'
import { environment } from '../../../environments/environment'
import { UserRecordOptions } from 'src/app/types/record.local'

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

  getKeywords(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<KeywordEndPoint> {
    //TODO GET PUBLIC DATA
    if (options.publicRecordId) {
      return of(undefined)
    }

    if (!this.$keywords) {
      this.$keywords = new ReplaySubject<KeywordEndPoint>(1)
    } else if (!options.forceReload) {
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
          this.$keywords.next(value)
        })
      )
      .subscribe()

    return this.$keywords
  }

  postKeywords(keywords: KeywordEndPoint): Observable<KeywordEndPoint> {
    return this._http
      .post<KeywordEndPoint>(
        environment.API_WEB + `my-orcid/keywordsForms.json`,
        keywords,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getKeywords({ forceReload: true }))
      )
  }
}
