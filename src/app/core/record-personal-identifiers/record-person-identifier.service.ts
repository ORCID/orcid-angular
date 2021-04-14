import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { retry, catchError, tap, map, switchMap } from 'rxjs/operators'
import { PersonIdentifierEndpoint } from 'src/app/types/record-person-identifier.endpoint'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

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
    private _errorHandler: ErrorHandlerService
  ) {}

  getPersonalIdentifiers(
    options: {
      forceReload?: boolean
      publicRecordId?: string
    } = {}
  ) {
    if (!options?.publicRecordId) {
      return this.getPrivateRecordPublicIdentifiers(options.forceReload)
    } else {
      return this.getPublicRecordPublicIdentifiers(
        options.forceReload,
        options.publicRecordId
      )
    }
  }

  getPublicRecordPublicIdentifiers(
    forceReload: boolean,
    publicRecordId: string
  ) {
    console.log('start loading public persona ids data')
    if (!this.$publicPersonIdentifier) {
      this.$publicPersonIdentifier = new ReplaySubject<PersonIdentifierEndpoint>()
    } else if (!forceReload) {
      return this.$publicPersonIdentifier
    }
    return of({})
  }

  private getPrivateRecordPublicIdentifiers(forceReload: boolean) {
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
