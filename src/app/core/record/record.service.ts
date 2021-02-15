import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { combineLatest, Observable, ReplaySubject } from 'rxjs'
import { catchError, retry, tap } from 'rxjs/operators'
import {
  Biography,
  EmailsEndpoint,
  ExternalIdentifier,
  Keywords,
  Names,
  OtherNames,
  Person,
  Preferences,
  Website,
} from 'src/app/types'
import { CountriesEndpoint } from 'src/app/types/record-country.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RecordCountriesService } from '../record-countries/record-countries.service'
import { RecordEmailsService } from '../record-emails/record-emails.service'

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  recordInitialized = false
  recordSubject$ = new ReplaySubject<UserRecord>(1)

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _recordEmailsService: RecordEmailsService,
    private _recordCountryService: RecordCountriesService
  ) {}

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  getRecord(id): Observable<UserRecord> {
    if (!this.recordInitialized) {
      this.recordInitialized = true

      combineLatest([
        this.getPerson(id),
        this._recordEmailsService.getEmails(),
        this.getOtherNames(),
        this._recordCountryService.getAddresses(),
        this.getKeywords(),
        this.getWebsites(),
        this.getExternalIdentifier(),
        this.getNames(),
        this.getBiography(),
        this.getPreferences(),
      ])
        .pipe(
          tap(
            ([
              person,
              emails,
              otherNames,
              countries,
              keyword,
              website,
              externalIdentifier,
              names,
              biography,
              preferences,
            ]) => {
              this.recordSubject$.next({
                person: person as Person,
                emails: emails as EmailsEndpoint,
                otherNames: otherNames as OtherNames,
                countries: countries as CountriesEndpoint,
                keyword: keyword as Keywords,
                website: website as Website,
                externalIdentifier: externalIdentifier as ExternalIdentifier,
                names: names as Names,
                biography: biography as Biography,
                preferences: preferences as Preferences,
              })
            }
          )
        )
        .subscribe()
    }

    return this.recordSubject$.pipe(
      tap((session) => (environment.debugger ? console.info(session) : null))
    )
  }

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

  getOtherNames(): Observable<OtherNames> {
    return this._http
      .get<OtherNames>(environment.API_WEB + `my-orcid/otherNamesForms.json`, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  postOtherNames(otherNames: OtherNames): Observable<OtherNames> {
    return this._http
      .post<OtherNames>(
        environment.API_WEB + `my-orcid/otherNamesForms.json`,
        otherNames,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getKeywords(): Observable<Keywords> {
    return this._http
      .get<Keywords>(environment.API_WEB + `my-orcid/keywordsForms.json`, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  postKeywords(keywords: Keywords): Observable<Keywords> {
    return this._http
      .post<Keywords>(
        environment.API_WEB + `my-orcid/keywordsForms.json`,
        keywords,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getWebsites(): Observable<Website> {
    return this._http
      .get<Website>(environment.API_WEB + `my-orcid/websitesForms.json`, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  postWebsites(website: Website): Observable<Keywords> {
    return this._http
      .post<Keywords>(
        environment.API_WEB + `my-orcid/websitesForms.json`,
        website,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getExternalIdentifier(): Observable<ExternalIdentifier> {
    return this._http
      .get<ExternalIdentifier>(
        environment.API_WEB + `my-orcid/externalIdentifiers.json`,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  // Just a place holder for posting external identifiers, since the frontend does never calls this function
  postExternalIdentifier(
    website: ExternalIdentifier
  ): Observable<ExternalIdentifier> {
    return this._http
      .post<ExternalIdentifier>(
        environment.API_WEB + `my-orcid/externalIdentifiers.json`,
        website,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getNames(): Observable<Names> {
    return this._http
      .get<Names>(
        environment.API_WEB + `account/nameForm.json`,

        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  postNames(names: Names): Observable<Names> {
    return this._http
      .post<Names>(environment.API_WEB + `account/nameForm.json`, names, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getBiography(): Observable<Biography> {
    return this._http
      .get<Biography>(
        environment.API_WEB + `account/biographyForm.json`,

        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  postBiography(names: Biography): Observable<Biography> {
    return this._http
      .post<Biography>(
        environment.API_WEB + `account/biographyForm.json`,
        names,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getPreferences(): Observable<Preferences> {
    return this._http
      .get<Preferences>(
        environment.API_WEB + `account/preferences.json`,

        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  postPreferences(names: Preferences): Observable<Preferences> {
    return this._http
      .post<Preferences>(
        environment.API_WEB + `account/preferences.json`,
        names,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
