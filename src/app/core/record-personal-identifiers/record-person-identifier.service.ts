import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { retry, catchError, tap, map, switchMap } from 'rxjs/operators'
import {
  CountriesEndpoint,
  RecordCountryCodesEndpoint,
} from 'src/app/types/record-country.endpoint'
import { PersonIdentifierEndpoint } from 'src/app/types/record-person-identifier.endpoint'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class RecordPersonIdentifierService {
  $externalIdentifiers: ReplaySubject<PersonIdentifierEndpoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getPersonalIdentifiers(forceReload = false) {
    if (!this.$externalIdentifiers) {
      this.$externalIdentifiers = new ReplaySubject<PersonIdentifierEndpoint>(1)
    } else if (!forceReload) {
      return this.$externalIdentifiers
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
          this.$externalIdentifiers.next(value)
        })
      )
      .subscribe()
    return this.$externalIdentifiers
  }

  postPersonalIdentifiers(
    otherNames: PersonIdentifierEndpoint
  ): Observable<PersonIdentifierEndpoint> {
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
        switchMap(() => this.getPersonalIdentifiers(true))
      )
  }
}
