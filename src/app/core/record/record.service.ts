import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { combineLatest, Observable, ReplaySubject } from 'rxjs'
import { catchError, retry, tap } from 'rxjs/operators'
import {
  EmailsEndpoint,
  ExternalIdentifier,
  Keywords,
  Person,
  PersonIdentifierEndpoint,
  Preferences,
} from 'src/app/types'
import { CountriesEndpoint } from 'src/app/types/record-country.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RecordCountriesService } from '../record-countries/record-countries.service'
import { RecordEmailsService } from '../record-emails/record-emails.service'
import { RecordBiographyService } from '../record-biography/record-biography.service'
import { RecordKeywordService } from '../record-keyword/record-keyword.service'
import { RecordNamesService } from '../record-names/record-names.service'
import { RecordOtherNamesService } from '../record-other-names/record-other-names.service'
import { OtherNamesEndPoint } from '../../types/record-other-names.endpoint'
import { KeywordEndPoint } from '../../types/record-keyword.endpoint'
import { NamesEndPoint } from '../../types/record-name.endpoint'
import { BiographyEndPoint } from '../../types/record-biography.endpoint'
import { RecordWebsitesService } from '../record-websites/record-websites.service'
import { WebsitesEndPoint } from '../../types/record-websites.endpoint'
import { RecordAffiliationService } from '../record-affiliations/record-affiliations.service'
import { AffiliationUIGroup } from 'src/app/types/record-affiliation.endpoint'
import { RecordPeerReviewService } from '../record-peer-review/record-peer-review.service'
import { RecordPersonIdentifierService } from '../record-personal-identifiers/record-person-identifier.service'
import { PeerReview } from '../../types/record-peer-review.endpoint'
import { RecordWorksService } from '../record-works/record-works.service'
import { WorksEndpoint } from 'src/app/types/record-works.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  recordInitialized = false
  recordSubject$ = new ReplaySubject<UserRecord>(1)

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _recordBiographyService: RecordBiographyService,
    private _recordKeywordService: RecordKeywordService,
    private _recordNamesService: RecordNamesService,
    private _recordOtherNamesService: RecordOtherNamesService,
    private _recordEmailsService: RecordEmailsService,
    private _recordCountryService: RecordCountriesService,
    private _recordWebsitesService: RecordWebsitesService,
    private _recordAffiliations: RecordAffiliationService,
    private _recordPersonalIdentifier: RecordPersonIdentifierService,
    private _recordPeerReviewService: RecordPeerReviewService,
    private _recordWorkService: RecordWorksService
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
        this._recordOtherNamesService.getOtherNames(),
        this._recordCountryService.getAddresses(),
        this._recordKeywordService.getKeywords(),
        this._recordWebsitesService.getWebsites(),
        this._recordPersonalIdentifier.getPersonalIdentifiers(),
        this._recordNamesService.getNames(),
        this._recordBiographyService.getBiography(),
        this._recordAffiliations.getAffiliations(),
        this.getPreferences(),
        this._recordPeerReviewService.getPeerReviewGroups(true),
        this._recordWorkService.getWorksService(),
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
              affiliations,
              preferences,
              peerReviews,
              works,
            ]) => {
              this.recordSubject$.next({
                person: person as Person,
                emails: emails as EmailsEndpoint,
                otherNames: otherNames as OtherNamesEndPoint,
                countries: countries as CountriesEndpoint,
                keyword: keyword as KeywordEndPoint,
                website: website as WebsitesEndPoint,
                externalIdentifier: externalIdentifier as PersonIdentifierEndpoint,
                names: names as NamesEndPoint,
                biography: biography as BiographyEndPoint,
                affiliations: affiliations as AffiliationUIGroup[],
                preferences: preferences as Preferences,
                peerReviews: peerReviews as PeerReview[],
                works: works as WorksEndpoint,
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
