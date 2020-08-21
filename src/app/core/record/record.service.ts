import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import {
  Person,
  Emails,
  OtherNames,
  Countries,
  Keywords,
  Website,
  ExternalIdentifier,
  Names,
  Biography,
  Preferences,
} from 'src/app/types'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { retry, catchError, tap } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { Address } from 'cluster'

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getPerson(id): Observable<Person> {
    return this._http
      .get<Person>(environment.API_WEB + `${id}/person.json`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
      .pipe(
        tap((data) => {
          // Changes publicGroupedAddresses keys for full country names
          if (data.publicGroupedAddresses) {
            Object.keys(data.publicGroupedAddresses).map((key) => {
              if (data.countryNames && data.countryNames[key]) {
                data.publicGroupedAddresses[data.countryNames[key]] =
                  data.publicGroupedAddresses[key]
                delete data.publicGroupedAddresses[key]
              }
            })
          }
        })
      )
  }

  getEmails(): Observable<Emails> {
    return this._http
      .get<Emails>(environment.API_WEB + `account/emails.json`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getOtherNames(): Observable<OtherNames> {
    return this._http
      .get<OtherNames>(environment.API_WEB + `my-orcid/otherNamesForms.json`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getAddresses(): Observable<Countries> {
    return this._http
      .get<Countries>(environment.API_WEB + `account/countryForm.json`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getKeywords(): Observable<Keywords> {
    return this._http
      .get<Keywords>(environment.API_WEB + `my-orcid/keywordsForms.json`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getWebsites(): Observable<Website> {
    return this._http
      .get<Website>(environment.API_WEB + `my-orcid/websitesForms.json`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getExternalIdentifier(): Observable<ExternalIdentifier> {
    return this._http
      .get<ExternalIdentifier>(
        environment.API_WEB + `my-orcid/externalIdentifiers.json`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getNames(): Observable<Names> {
    return this._http
      .get<Names>(environment.API_WEB + `account/nameForm.json`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getBiography(): Observable<Biography> {
    return this._http
      .get<Biography>(environment.API_WEB + `account/biographyForm.json`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getPreferences(): Observable<Preferences> {
    return this._http
      .get<Preferences>(environment.API_WEB + `account/preferences.json`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
