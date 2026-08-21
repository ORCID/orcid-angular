import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { RecordCorrectionsPage } from 'src/app/types/record-corrections.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class RecordCorrectionsService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })

  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {}

  // The backend paginates by row id rather than by page number: `afterId` is the
  // last id of the current page, `beforeId` the first one. Omitting the id asks
  // for the newest page.
  getNextPage(afterId?: number): Observable<RecordCorrectionsPage> {
    return this.getPage('next', afterId)
  }

  getPreviousPage(beforeId?: number): Observable<RecordCorrectionsPage> {
    return this.getPage('previous', beforeId)
  }

  private getPage(
    direction: 'next' | 'previous',
    id?: number
  ): Observable<RecordCorrectionsPage> {
    const cursor = id !== undefined && id !== null ? '/' + id : ''
    return this._http
      .get<RecordCorrectionsPage>(
        runtimeEnvironment.API_WEB + `record-corrections/${direction}${cursor}`,
        { headers: this.headers }
      )
      .pipe(catchError((error) => this._errorHandler.handleError(error)))
  }
}
