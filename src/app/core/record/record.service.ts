import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { combineLatest, Observable, of, ReplaySubject, Subject } from 'rxjs'
import {
  catchError,
  map,
  retry,
  startWith,
  takeUntil,
  tap,
} from 'rxjs/operators'
import {
  EmailsEndpoint,
  ExternalIdentifier,
  Keywords,
  PersonIdentifierEndpoint,
  Preferences,
  UserInfo,
} from 'src/app/types'
import { CountriesEndpoint } from 'src/app/types/record-country.endpoint'
import { UserRecord, UserRecordOptions } from 'src/app/types/record.local'

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
import { RecordFundingsService } from '../record-fundings/record-fundings.service'
import { FundingGroup } from 'src/app/types/record-funding.endpoint'
import { PeerReview } from '../../types/record-peer-review.endpoint'
import { RecordResearchResourceService } from '../record-research-resource/record-research-resource.service'
import { ResearchResourcesEndpoint } from '../../types/record-research-resources.endpoint'
import { RecordWorksService } from '../record-works/record-works.service'
import { WorksEndpoint } from 'src/app/types/record-works.endpoint'
import { RecordPersonService } from '../record-person/record-person.service'
import { RecordPublicSideBarService } from '../record-public-side-bar/record-public-side-bar.service'
import { UserInfoService } from '../user-info/user-info.service'

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  recordSubject$: ReplaySubject<UserRecord>
  private readonly $destroy = new Subject<void>()
  getRecordPerformanceStartTime: number

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
    private _recordFundings: RecordFundingsService,
    private _recordPersonalIdentifier: RecordPersonIdentifierService,
    private _recordPeerReviewService: RecordPeerReviewService,
    private _recordResearchResourceService: RecordResearchResourceService,
    private _recordWorkService: RecordWorksService,
    private _recordPerson: RecordPersonService,
    private _recordPublicSidebar: RecordPublicSideBarService,
    private _userInfo: UserInfoService
  ) {}

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })

  subscriptionSourceCountDebugger = 0
  /**
   * @param options:
   * - use `forceReload` to force all server calls.
   * - use `publicRecordId` to load a public record or leave the `publicRecordId` undefined
   * to load the current user private record.
   *
   * Note: sending the `privateRecordId` is deprecated
   *
   * @returns And subject with all the require data from private or public orcid record
   */
  getRecord(options?: UserRecordOptions): Observable<UserRecord> {
    // Init a time for performance debugging

    if (!this.recordSubject$) {
      this.recordSubject$ = new ReplaySubject<UserRecord>(1)
      this.attachDebugger()
    } else if (!options?.forceReload) {
      return this.recordSubject$.asObservable()
    }

    if (this.recordSubject$ && options?.cleanCacheIfExist) {
      this.recordSubject$.next(undefined)
    }
    const subscriptionCount = this.subscriptionSourceCountDebugger
    this.subscriptionSourceCountDebugger =
      this.subscriptionSourceCountDebugger + 1

    // Un-subscribe from previous combineLatest subscriptions
    this.$destroy.next()
    // Subscribe to a new combineLatest http calls subscription

    if (runtimeEnvironment.debugger) {
      this.getRecordPerformanceStartTime = performance.now()
    }

    combineLatest([
      this._recordEmailsService
        .getEmails(options)
        .pipe(startWith(<Object>undefined)),
      this._recordOtherNamesService
        .getOtherNames(options)
        .pipe(startWith(<Object>undefined)),
      this._recordCountryService
        .getAddresses(options)
        .pipe(startWith(<Object>undefined)),
      this._recordKeywordService
        .getKeywords(options)
        .pipe(startWith(<Object>undefined)),
      this._recordWebsitesService
        .getWebsites(options)
        .pipe(startWith(<Object>undefined)),
      this._recordPersonalIdentifier
        .getPersonalIdentifiers(options)
        .pipe(startWith(<Object>undefined)),
      this._recordNamesService
        .getNames(options)
        .pipe(startWith(<Object>undefined)),
      this._recordBiographyService
        .getBiography(options)
        .pipe(startWith(<Object>undefined)),
      this._recordAffiliations
        .getAffiliations(options)
        .pipe(startWith(<Object>undefined)),
      this._recordFundings
        .getFundings(options)
        .pipe(startWith(<Object>undefined)),
      this.getPreferences(options)?.pipe(startWith(<Object>undefined)),
      this._recordPeerReviewService
        .getPeerReviewGroups(options)
        .pipe(startWith(<Object>undefined)),
      this._recordResearchResourceService
        .getResearchResourcePage(options)
        .pipe(startWith(<Object>undefined)),
      this._recordWorkService
        .getWorks(options)
        .pipe(startWith(<Object>undefined)),
      this._recordWorkService
        .getFeaturedWorks(options)
        .pipe(startWith(<Object>undefined)),
      this.getLastModifiedTime(options).pipe(startWith(<Object>undefined)),
      this._userInfo.getUserInfo(options).pipe(startWith(<Object>undefined)),
    ])
      .pipe(
        tap(
          ([
            emails,
            otherNames,
            countries,
            keyword,
            website,
            externalIdentifier,
            names,
            biography,
            affiliations,
            fundings,
            preferences,
            peerReviews,
            researchResources,
            works,
            featuredWorks,
            lastModifiedTime,
            userInfo,
          ]) => {
            this.recordSubject$.next({
              subscriptionCount: subscriptionCount,
              emails: emails as EmailsEndpoint,
              otherNames: otherNames as OtherNamesEndPoint,
              countries: countries as CountriesEndpoint,
              keyword: keyword as KeywordEndPoint,
              website: website as WebsitesEndPoint,
              externalIdentifier:
                externalIdentifier as PersonIdentifierEndpoint,
              names: names as NamesEndPoint,
              biography: biography as BiographyEndPoint,
              affiliations: affiliations as AffiliationUIGroup[],
              fundings: fundings as FundingGroup[],
              preferences: preferences as Preferences,
              peerReviews: peerReviews as PeerReview[],
              researchResources: researchResources as ResearchResourcesEndpoint,
              works: works as WorksEndpoint,
              featuredWorks: featuredWorks as WorksEndpoint,
              lastModifiedTime: lastModifiedTime as any,
              userInfo: userInfo as UserInfo,
            })
          }
        ),
        takeUntil(this.$destroy)
      )

      .subscribe()

    return this.recordSubject$.asObservable()
  }
  attachDebugger() {
    if (runtimeEnvironment.debugger) {
      this.recordSubject$.subscribe((value) => {
        if (value === undefined) {
          return
        }
        // Once all values are loaded, we can check the time
        const allValuesLoaded = !Object.keys(value).find(
          (key) => value[key] === undefined
        )

        if (allValuesLoaded) {
          if (this.getRecordPerformanceStartTime) {
            const executionTime =
              performance.now() - this.getRecordPerformanceStartTime
            this.getRecordPerformanceStartTime = undefined
            console.info(
              '[Record Service] :',
              'Time to load all record data:',
              executionTime,
              'ms'
            )

            console.info('[Record Service] :', 'Initial data:', value)
          } else {
            console.info('[Record Service] Data refreshed:', value)
          }
        }
      })
    }
  }

  getExternalIdentifier(): Observable<ExternalIdentifier> {
    return this._http
      .get<ExternalIdentifier>(
        runtimeEnvironment.API_WEB + `my-orcid/externalIdentifiers.json`,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getKeywords(): Observable<Keywords> {
    return this._http
      .get<Keywords>(
        runtimeEnvironment.API_WEB + `my-orcid/keywordsForms.json`,
        {
          headers: this.headers,
        }
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
        runtimeEnvironment.API_WEB + `my-orcid/externalIdentifiers.json`,
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
        runtimeEnvironment.API_WEB + `my-orcid/keywordsForms.json`,
        keywords,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getPreferences(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<Preferences> {
    // TODO GET PUBLIC DATA
    if (options.publicRecordId) {
      return of(undefined)
    }

    return this._http
      .get<Preferences>(
        runtimeEnvironment.API_WEB + `account/preferences.json`,

        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        catchError(() => of({} as Preferences))
      )
  }

  postPreferences(names: Preferences): Observable<Preferences> {
    return this._http
      .post<Preferences>(
        runtimeEnvironment.API_WEB + `account/preferences.json`,
        names,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getLastModifiedTime(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ) {
    if (options.publicRecordId) {
      return this._recordPublicSidebar
        .getPublicRecordSideBar(options)
        .pipe(map((value) => value.lastModifiedTime))
    }
    return of('')
  }
}
