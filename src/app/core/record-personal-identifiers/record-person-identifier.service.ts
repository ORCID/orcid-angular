import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { of, ReplaySubject } from 'rxjs'
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators'
import { ArrayFlat, DateToMonthDayYearDateAdapter } from 'src/app/constants'
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
          this.publicDataAdapterExternalIdentifier(
            publicGroupedPersonExternalIdentifiers
          )
        ),
        catchError((error) => this._errorHandler.handleError(error)),
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

  publicDataAdapterExternalIdentifier(
    personIdentifiers: PublicGroupedPersonExternalIdentifiers
  ): PersonIdentifierEndpoint {
    return {
      errors: [],
      externalIdentifiers: ArrayFlat(
        Object.keys(personIdentifiers).map((i) => {
          return personIdentifiers[i].map((personIdentifier) => {
            return {
              visibility: {
                visibility: 'PUBLIC',
              },
              errors: [],
              commonName: personIdentifier.type,
              reference: personIdentifier.value,
              url: personIdentifier?.url?.value,
              source: personIdentifier?.source?.sourceClientId?.path,
              sourceName: personIdentifier?.source?.sourceName?.content,
              displayIndex: personIdentifier.displayIndex,
              putCode: personIdentifier.putCode,
              createdDate: DateToMonthDayYearDateAdapter(
                personIdentifier?.createdDate?.value
              ),
              lastModified: DateToMonthDayYearDateAdapter(
                personIdentifier?.lastModifiedDate?.value
              ),
              assertionOriginOrcid: null,
              assertionOriginClientId: null,
              assertionOriginName: null,
            }
          })
        })
      ),
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
