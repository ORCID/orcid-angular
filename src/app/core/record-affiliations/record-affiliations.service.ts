import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs'
import {
  catchError,
  finalize,
  map,
  retry,
  switchMap,
  tap,
} from 'rxjs/operators'
import {
  AffiliationUIGroup,
  AffiliationsEndpoint,
  Affiliation,
  Organization,
  DisambiguatedOrganization,
  EmploymentsEndpoint,
} from 'src/app/types/record-affiliation.endpoint'

import { AffiliationsSortService } from '../record-affiliations-sort/record-affiliations-sort.service'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RecordAffiliationsGroupingService } from '../record-affiliations-affiliations-grouping/record-affiliations-grouping.service'
import { cloneDeep } from 'lodash'
import { UserRecordOptions } from 'src/app/types/record.local'
import { VisibilityStrings } from '../../types/common.endpoint'
import { getAffiliationType } from '../../constants'

@Injectable({
  providedIn: 'root',
})
export class RecordAffiliationService {
  lastEmittedValue: AffiliationUIGroup[]
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
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
        runtimeEnvironment.API_WEB +
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
          runtimeEnvironment.API_WEB +
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
          runtimeEnvironment.API_WEB + `affiliations/affiliationGroups.json`
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
    const professionalActivities = this.lastEmittedValue.find(
      (profileAffiliation) =>
        profileAffiliation.type === 'PROFESSIONAL_ACTIVITIES'
    )
    const lastEmittedProfessional = [
      ...getAffiliationType(
        this.lastEmittedValue,
        'INVITED_POSITION_AND_DISTINCTION'
      ).affiliationGroup,
      ...getAffiliationType(this.lastEmittedValue, 'MEMBERSHIP_AND_SERVICE')
        .affiliationGroup,
    ]

    if (professionalActivities) {
      professionalActivities.affiliationGroup = lastEmittedProfessional
    } else {
      this.lastEmittedValue.push({
        type: 'PROFESSIONAL_ACTIVITIES',
        affiliationGroup: lastEmittedProfessional,
      })
    }
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
        runtimeEnvironment.API_WEB + 'affiliations/affiliation.json',
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
    if (org.length > 2) {
      return this._http
        .get<Organization[]>(
          runtimeEnvironment.API_WEB +
            'affiliations/disambiguated/name/' +
            org +
            '?limit=100',
          {
            headers: this.headers,
          }
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error))
        )
    } else {
      return of([])
    }
  }

  getOrganizationDisambiguated(
    id: string
  ): Observable<DisambiguatedOrganization> {
    return this._http
      .get<DisambiguatedOrganization>(
        runtimeEnvironment.API_WEB + 'affiliations/disambiguated/id/' + id,
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
        runtimeEnvironment.API_WEB +
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
        runtimeEnvironment.API_WEB +
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
        runtimeEnvironment.API_WEB +
          'affiliations/updateToMaxDisplay.json?putCode=' +
          putCode
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getAffiliations({ forceReload: true }))
      )
  }

  updateFeatured(
    affiliation: Affiliation,
    togglingOn: boolean
  ): Observable<any> {
    const targetPutCode = togglingOn ? affiliation.putCode.value : ''
    const previousState = cloneDeep(this.lastEmittedValue)

    // Optimistically update the shared affiliations observable so all consumers
    // see the featured change immediately.
    // This prevents multiple panels from briefly showing as featured while we wait for the reload (PD-3859)
    if (this.lastEmittedValue && this.$affiliations) {
      this.lastEmittedValue.forEach((uiGroup) => {
        uiGroup.affiliationGroup?.forEach((group) => {
          group.affiliations?.forEach((item) => {
            if (item.affiliationType?.value !== 'employment') {
              return
            }
            item.featured =
              togglingOn && item.putCode?.value === affiliation.putCode.value
          })
        })
      })
      this.$affiliations.next(this.lastEmittedValue)
    }

    this._$loading.next(true)
    return this._http
      .put(
        runtimeEnvironment.API_WEB + 'affiliations/featuredAffiliation.json',
        {
          putCode: targetPutCode,
        },
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => {
          // Revert optimistic update on failure
          if (previousState && this.$affiliations) {
            this.lastEmittedValue = previousState
            this.$affiliations.next(this.lastEmittedValue)
          }
          return this._errorHandler.handleError(error)
        }),
        tap(() => this.getAffiliations({ forceReload: true })),
        finalize(() => this._$loading.next(false))
      )
  }

  getEmployments(): Observable<EmploymentsEndpoint> {
    return this._http
      .get<EmploymentsEndpoint>(
        runtimeEnvironment.API_WEB + 'affiliations/employments.json',
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
