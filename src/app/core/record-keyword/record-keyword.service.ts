import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, ReplaySubject } from 'rxjs'
import { catchError, map, retry, tap } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { KeywordEndPoint } from '../../types/record-keyword.endpoint'
import { environment } from '../../../environments/environment'
import { UserRecordOptions } from 'src/app/types/record.local'
import { RecordPublicSideBarService } from '../record-public-side-bar/record-public-side-bar.service'

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
    private _errorHandler: ErrorHandlerService,
    private _recordPublicSidebar: RecordPublicSideBarService
  ) {}

  getKeywords(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<KeywordEndPoint> {
    if (options.publicRecordId) {
      return this._recordPublicSidebar
        .getPublicRecordSideBar(options)
        .pipe(map((value) => value.keyword))
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
        catchError(() => of({ keywords: [] } as KeywordEndPoint)),
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
