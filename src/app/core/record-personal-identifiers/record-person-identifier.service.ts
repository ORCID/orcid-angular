import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { retry, catchError, tap, map, switchMap } from 'rxjs/operators'
import {
  CountriesEndpoint,
  RecordCountryCodesEndpoint,
} from 'src/app/types/record-country.endpoint'
import { PersonalIdentifierEndpoint } from 'src/app/types/record-personal-identifier.endpoint'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class RecordPersonIdentifierService {
  $externalIdentifiers: ReplaySubject<PersonalIdentifierEndpoint>
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
      this.$externalIdentifiers = new ReplaySubject<PersonalIdentifierEndpoint>(
        1
      )
    } else if (!forceReload) {
      return this.$externalIdentifiers
    }

    this._http
      .get<PersonalIdentifierEndpoint>(
        environment.API_WEB + `my-orcid/externalIdentifiers.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        map((value: PersonalIdentifierEndpoint) => {
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
    otherNames: PersonalIdentifierEndpoint
  ): Observable<PersonalIdentifierEndpoint> {
    return this._http
      .post<PersonalIdentifierEndpoint>(
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
