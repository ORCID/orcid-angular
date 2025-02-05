import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { retry, catchError, tap } from 'rxjs/operators'
import {
  SideBarPublicUserRecord,
  UserRecord,
  UserRecordOptions,
} from 'src/app/types/record.local'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { setProfessionalEmails } from '../utils'

@Injectable({
  providedIn: 'root',
})
export class RecordPublicSideBarService {
  private $SideBarPublicUserRecordSubject: ReplaySubject<SideBarPublicUserRecord>
  sleepForceReloads: boolean

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })

  getPublicRecordSideBar(
    options: UserRecordOptions
  ): Observable<SideBarPublicUserRecord> {
    if (options.publicRecordId) {
      if (
        !this.$SideBarPublicUserRecordSubject ||
        (options.forceReload && !this.sleepForceReloads)
      ) {
        this.sleepForceReloads = true
        this.$SideBarPublicUserRecordSubject =
          new ReplaySubject<SideBarPublicUserRecord>(1)
        setTimeout(() => {
          this.sleepForceReloads = false
        }, 100)
      } else {
        return this.$SideBarPublicUserRecordSubject.asObservable()
      }

      return this._http
        .get<UserRecord>(
          runtimeEnvironment.API_WEB +
            options.publicRecordId +
            `/public-record.json`,
          {
            headers: this.headers,
          }
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          catchError(() => of({} as SideBarPublicUserRecord)),
          tap((record) => {
            record.emails = setProfessionalEmails(record.emails)
            this.$SideBarPublicUserRecordSubject.next(record)
          })
        )
    } else {
      of({})
    }
  }
}
