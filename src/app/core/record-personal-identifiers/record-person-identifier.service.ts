import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators'
import { PersonIdentifierEndpoint } from 'src/app/types/record-person-identifier.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RecordPersonService } from '../record-person/record-person.service'
import { RecordPublicSideBarService } from '../record-public-side-bar/record-public-side-bar.service'

@Injectable({
  providedIn: 'root',
})
export class RecordPersonIdentifierService {
  $publicPersonIdentifier: ReplaySubject<PersonIdentifierEndpoint>
  $privatePersonIdentifier: ReplaySubject<PersonIdentifierEndpoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _recordPerson: RecordPersonService,
    private _recordPublicSidebar: RecordPublicSideBarService
  ) {}

  getPersonalIdentifiers(
    options: UserRecordOptions = {}
  ): Observable<PersonIdentifierEndpoint> {
    if (options.publicRecordId) {
      return this._recordPublicSidebar
        .getPublicRecordSideBar(options.publicRecordId)
        .pipe(map((value) => value.externalIdentifier))
    }

    return this.getPrivateRecordIdentifiers(options.forceReload).asObservable()
  }

  private getPrivateRecordIdentifiers(
    forceReload: boolean
  ): ReplaySubject<PersonIdentifierEndpoint> {
    if (!this.$privatePersonIdentifier) {
      this.$privatePersonIdentifier = new ReplaySubject<PersonIdentifierEndpoint>()
    } else if (!forceReload) {
      return this.$privatePersonIdentifier
    }

    this._http
      .get<PersonIdentifierEndpoint>(
        environment.API_WEB + `my-orcid/externalIdentifiers.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        map((value: PersonIdentifierEndpoint) => {
          return value
        }),
        tap((value) => {
          this.$privatePersonIdentifier.next(value)
        })
      )
      .subscribe()
    return this.$privatePersonIdentifier
  }

  postPersonalIdentifiers(otherNames: PersonIdentifierEndpoint) {
    return this._http
      .post<PersonIdentifierEndpoint>(
        environment.API_WEB + `my-orcid/externalIdentifiers.json`,
        otherNames,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap(() => this.getPersonalIdentifiers({ forceReload: true }))
      )
  }
}
