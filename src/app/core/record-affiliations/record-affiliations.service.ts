import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs'
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators'
import {
  AffiliationUIGroup,
  AffiliationsEndpoint,
  Affiliation,
  Organization,
  DisambiguatedOrganization,
} from 'src/app/types/record-affiliation.endpoint'
import { environment } from 'src/environments/environment'

import { AffiliationsSortService } from '../record-affiliations-sort/record-affiliations-sort.service'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RecordAffiliationsGroupingService } from '../record-affiliations-affiliations-grouping/record-affiliations-grouping.service'
import { cloneDeep } from 'lodash'
import { UserRecordOptions } from 'src/app/types/record.local'
import { VisibilityStrings } from '../../types/common.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RecordAffiliationService {
  lastEmittedValue: AffiliationUIGroup[]
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  $affiliations: ReplaySubject<AffiliationUIGroup[]>
  private _$loading = new BehaviorSubject<boolean>(true)
  public get $loading() {
    return this._$loading.asObservable()
  }

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _affiliationsGroupingService: RecordAffiliationsGroupingService,
    private _affiliationsSortService: AffiliationsSortService
  ) {}

  getAffiliations(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<AffiliationUIGroup[]> {
    if (!this.$affiliations) {
      this.$affiliations = new ReplaySubject(1)
    } else if (!options.forceReload) {
      return this.$affiliations
    }

    if (options.cleanCacheIfExist && this.$affiliations) {
      this.$affiliations.next(undefined)
    }

    this._$loading.next(true)
    this.getGroupAndSortAffiliations(options)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        catchError(() => of([])),
        tap((value) => {
          this._$loading.next(false)
          this.lastEmittedValue = cloneDeep(value)
          this.$affiliations.next(value)
        })
      )
      .subscribe()

    return this.$affiliations.asObservable()
  }

  // Getting the "affiliations details" seems like a waste of network resources.
  // This will only return a url which on the first call comes as null.
  getAffiliationsDetails(
    type,
    putCode,
    options?: UserRecordOptions
  ): Observable<AffiliationUIGroup[]> {
    return this.getAffiliationDetails(putCode, type, options).pipe(
      tap((data) => {
        if (data && data.url && data.url.value) {
          this.lastEmittedValue.forEach((affiliations) => {
            affiliations.affiliationGroup.map((affiliationsStack) => {
              affiliationsStack.affiliations.map((affiliation) => {
                if (
                  affiliation.affiliationType.value === type &&
                  affiliation.putCode.value === putCode
                ) {
                  affiliation.url.value = data.url.value
                }
              })
            })
          })
        }
        this.$affiliations.next(this.lastEmittedValue)
      }),
      switchMap(() => {
        return this.$affiliations.asObservable()
      })
    )
  }

  private getAffiliationDetails(
    putCode,
    type,
    options?: UserRecordOptions
  ): Observable<Affiliation> {
    return this._http
      .get<Affiliation>(
        environment.API_WEB +
          `${
            options?.publicRecordId
              ? options?.publicRecordId + '/'
              : 'affiliations/'
          }affiliationDetails.json?id=${putCode}&type=${type}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  private getGroupAndSortAffiliations(
    options: UserRecordOptions
  ): Observable<AffiliationUIGroup[]> {
    if (options.publicRecordId) {
      return this._http
        .get<AffiliationsEndpoint>(
          environment.API_WEB +
            `${options.publicRecordId}/affiliationGroups.json`
        )
        .pipe(
          retry(3),
          map((data) => this._affiliationsGroupingService.transform(data)),
          map((data) => this._affiliationsSortService.transform(data)),
          catchError((error) => this._errorHandler.handleError(error))
        )
    } else {
      return this._http
        .get<AffiliationsEndpoint>(
          environment.API_WEB + `affiliations/affiliationGroups.json`
        )
        .pipe(
          retry(3),
          map((data) => this._affiliationsGroupingService.transform(data)),
          map((data) => this._affiliationsSortService.transform(data)),
          catchError((error) => this._errorHandler.handleError(error))
        )
    }
  }

  changeUserRecordContext(userRecordContext: UserRecordOptions, type: string) {
    const value = this._affiliationsSortService.transform(
      this.lastEmittedValue,
      userRecordContext,
      type
    )
    this.lastEmittedValue = cloneDeep(value)
    this.$affiliations.next(value)
  }

  postAffiliation(affiliation): Observable<Affiliation> {
    return this._http
      .post<Affiliation>(
        environment.API_WEB + 'affiliations/affiliation.json',
        affiliation,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getAffiliations({ forceReload: true }))
      )
  }

  getOrganization(org: string): Observable<Organization[]> {
    return of([
      {
        sourceId: '525183',
        country: 'DE',
        orgType: 'corporate/serv',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.DE',
        disambiguatedAffiliationIdentifier: '2053426',
        city: 'Hamburg',
        sourceType: 'RINGGOLD',
        region: 'Hamburg',
        value: 'wordinc GmbH',
        url: null,
        affiliationKey: 'wordinc GmbH Hamburg Hamburg DE',
      },
      {
        sourceId: '483612',
        country: 'US',
        orgType: 'academic/medsch',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.US',
        disambiguatedAffiliationIdentifier: '563779',
        city: 'San Antonio',
        sourceType: 'RINGGOLD',
        region: 'TX',
        value:
          'University of the Incarnate Word School of Osteopathic Medicine',
        url: null,
        affiliationKey:
          'University of the Incarnate Word School of Osteopathic Medicine San Antonio TX US',
      },
      {
        sourceId: '494073',
        country: 'DE',
        orgType: 'consortium/library',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.DE',
        disambiguatedAffiliationIdentifier: '573879',
        city: 'Berlin',
        sourceType: 'RINGGOLD',
        region: 'Berlin',
        value:
          'Fachinformationsverbund Internationale Beziehungen und Länderkunde World Affairs Online',
        url: null,
        affiliationKey:
          'Fachinformationsverbund Internationale Beziehungen und Länderkunde World Affairs Online Berlin Berlin DE',
      },
      {
        sourceId: '489390',
        country: 'PH',
        orgType: 'academic',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.PH',
        disambiguatedAffiliationIdentifier: '569416',
        city: 'Calapan City',
        sourceType: 'RINGGOLD',
        region: 'Oriental Mindoro',
        value: 'Divine Word College of Calapan',
        url: null,
        affiliationKey:
          'Divine Word College of Calapan Calapan City Oriental Mindoro PH',
      },
      {
        sourceId: '116607',
        country: 'US',
        orgType: 'other/advocates',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.US',
        disambiguatedAffiliationIdentifier: '111263',
        city: 'Washington',
        sourceType: 'RINGGOLD',
        region: 'DC',
        value: 'American Postal Workers Union',
        url: null,
        affiliationKey: 'American Postal Workers Union Washington DC US',
      },
      {
        sourceId: '152795',
        country: 'CA',
        orgType: 'other/health',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.CA',
        disambiguatedAffiliationIdentifier: '145845',
        city: 'Whitehorse',
        sourceType: 'RINGGOLD',
        region: 'YT',
        value: "Yukon Workers' Compensation Health and Safety Board",
        url: null,
        affiliationKey:
          "Yukon Workers' Compensation Health and Safety Board Whitehorse YT CA",
      },
      {
        sourceId: '422798',
        country: 'AU',
        orgType: 'corporate/serv',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.AU',
        disambiguatedAffiliationIdentifier: '418276',
        city: 'Oakleigh',
        sourceType: 'RINGGOLD',
        region: 'VIC',
        value: "Wordsmiths' Ink",
        url: null,
        affiliationKey: "Wordsmiths' Ink Oakleigh VIC AU",
      },
      {
        sourceId: '407273',
        country: 'GB',
        orgType: 'corporate/dissolved',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.GB',
        disambiguatedAffiliationIdentifier: '407182',
        city: 'Saffron Walden',
        sourceType: 'RINGGOLD',
        region: 'Essex',
        value: 'World of Information Ltd',
        url: null,
        affiliationKey: 'World of Information Ltd Saffron Walden Essex GB',
      },
      {
        sourceId: '53601',
        country: 'US',
        orgType: 'other/advocates',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.US',
        disambiguatedAffiliationIdentifier: '51214',
        city: 'Reston',
        sourceType: 'RINGGOLD',
        region: 'VA',
        value: 'World Press Freedom Committee',
        url: null,
        affiliationKey: 'World Press Freedom Committee Reston VA US',
      },
      {
        sourceId: '139134',
        country: 'US',
        orgType: 'other/religion',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.US',
        disambiguatedAffiliationIdentifier: '132628',
        city: 'New York',
        sourceType: 'RINGGOLD',
        region: 'NY',
        value: 'World Federation of Methodist and Uniting Church Women',
        url: null,
        affiliationKey:
          'World Federation of Methodist and Uniting Church Women New York NY US',
      },
    ]).pipe(
      retry(3),
      catchError((error) => this._errorHandler.handleError(error))
    )
  }

  getOrganizationDisambiguated(
    id: string
  ): Observable<DisambiguatedOrganization> {
    return this._http
      .get<DisambiguatedOrganization>(
        environment.API_WEB + 'affiliations/disambiguated/id/' + id,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  updateVisibility(
    putCode: string,
    visibility: VisibilityStrings
  ): Observable<any> {
    return this._http
      .get(
        environment.API_WEB +
          'affiliations/' +
          putCode +
          '/visibility/' +
          visibility
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getAffiliations({ forceReload: true }))
      )
  }

  delete(putCode: string): Observable<any> {
    return this._http
      .delete(
        environment.API_WEB +
          'affiliations/affiliation.json' +
          '?id=' +
          encodeURIComponent(putCode)
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getAffiliations({ forceReload: true }))
      )
  }

  updatePreferredSource(putCode: string): Observable<any> {
    return this._http
      .get(
        environment.API_WEB +
          'affiliations/updateToMaxDisplay.json?putCode=' +
          putCode
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getAffiliations({ forceReload: true }))
      )
  }
}
