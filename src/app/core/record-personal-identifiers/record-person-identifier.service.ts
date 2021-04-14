import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { of, ReplaySubject } from 'rxjs'
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators'
import { VISIBILITY_OPTIONS } from 'src/app/constants'
import { PublicGroupedPersonExternalIdentifiers } from 'src/app/types'
import { PersonIdentifierEndpoint } from 'src/app/types/record-person-identifier.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RecordPersonService } from '../record-person/record-person.service'

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
    private _recordPerson: RecordPersonService
  ) {}

  getPersonalIdentifiers(
    options: UserRecordOptions = {}
  ): ReplaySubject<PersonIdentifierEndpoint> {
    if (!options?.publicRecordId) {
      return this.getPrivateRecordIdentifiers(options.forceReload)
    } else {
      return this.getPublicRecordIdentifiers(options)
    }
  }

  getPublicRecordIdentifiers(
    options: UserRecordOptions
  ): ReplaySubject<PersonIdentifierEndpoint> {
    if (!this.$publicPersonIdentifier) {
      this.$publicPersonIdentifier = new ReplaySubject<PersonIdentifierEndpoint>()
    } else if (!options.forceReload) {
      return this.$publicPersonIdentifier
    }

    this._recordPerson
      .getPerson(options)
      .pipe(
        map((person) => person.publicGroupedPersonExternalIdentifiers),
        map((publicGroupedPersonExternalIdentifiers) =>
          this.publicGroupedPersonExternalIdentifiersAdapter(
            publicGroupedPersonExternalIdentifiers
          )
        ),
        catchError((error) => this._errorHandler.handleError(error)),
        tap((value) => {
          console.log('OK I HAVE AN ADAPTED VALUE')

          console.log(value)
        }),
        tap((value) => {
          this.$publicPersonIdentifier.next(value)
        })
      )
      .subscribe()
    return this.$publicPersonIdentifier
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

  publicGroupedPersonExternalIdentifiersAdapter(
    personIdentifiers: PublicGroupedPersonExternalIdentifiers
  ): PersonIdentifierEndpoint {
    return {
      errors: [],
      externalIdentifiers: [
        {
          visibility: {
            errors: [],
            required: true,
            getRequiredMessage: null,
            visibility: 'PUBLIC',
          },
          errors: [],
          commonName: 'API',
          reference: '88',
          url: 'http://www.orcid.org/88',
          source: '0000-0003-1084-4015',
          sourceName: "Cat's app for testing",
          displayIndex: 2,
          putCode: '1460',
          createdDate: {
            errors: [],
            month: '10',
            day: '10',
            year: '2017',
            required: true,
            getRequiredMessage: null,
          },
          lastModified: {
            errors: [],
            month: '4',
            day: '14',
            year: '2021',
            required: true,
            getRequiredMessage: null,
          },
          assertionOriginOrcid: null,
          assertionOriginClientId: null,
          assertionOriginName: null,
        },
      ],
      visibility: { visibility: 'PUBLIC' },
    }
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
