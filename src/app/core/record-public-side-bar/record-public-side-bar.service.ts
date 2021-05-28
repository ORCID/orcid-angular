import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { observable, Observable, of, ReplaySubject } from 'rxjs'
import { retry, catchError, tap } from 'rxjs/operators'
import {
  SideBarPublicUserRecord,
  UserRecord,
  UserRecordOptions,
} from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class RecordPublicSideBarService {
  private $SideBarPublicUserRecordSubject: ReplaySubject<SideBarPublicUserRecord>

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  getPublicRecordSideBar(
    options: UserRecordOptions
  ): Observable<SideBarPublicUserRecord> {
    if (options.publicRecordId) {
      if (!this.$SideBarPublicUserRecordSubject || options.forceReload) {
        this.$SideBarPublicUserRecordSubject = new ReplaySubject<SideBarPublicUserRecord>(
          1
        )
      } else {
        return this.$SideBarPublicUserRecordSubject.asObservable()
      }

      return this._http
        .get<UserRecord>(
          environment.API_WEB + options.publicRecordId + `/public-record.json`,
          {
            headers: this.headers,
          }
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          tap((value) => this.$SideBarPublicUserRecordSubject.next(value))
        )
    } else {
      of({})
    }
  }
}
