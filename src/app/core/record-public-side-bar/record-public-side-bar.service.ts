import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { retry, catchError } from 'rxjs/operators'
import { UserRecord } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment.production'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class RecordPublicSideBarService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  getPublicRecordSideBar(orcid: string): Observable<UserRecord> {
    return this._http
      .get<UserRecord>(environment.API_WEB + orcid + `/public-record.json`, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
