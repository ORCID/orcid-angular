import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { catchError, retry, switchMap, tap } from 'rxjs/operators'
import { Funding, FundingGroup } from 'src/app/types/record-funding.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { VisibilityStrings, Organization } from '../../types/common.endpoint'
import { RecordImportWizard } from '../../types/record-peer-review-import.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RecordFundingsService {
  lastEmittedValue: FundingGroup[]
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  $fundings: ReplaySubject<FundingGroup[]> = new ReplaySubject<FundingGroup[]>()

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getFundings(options: UserRecordOptions): Observable<FundingGroup[]> {
    if (options.publicRecordId) {
      this._http
        .get<FundingGroup[]>(
          environment.API_WEB +
            options.publicRecordId +
            '/fundingGroups.json?' +
            '&sort=' +
            (options.sort != null ? options.sort : 'date') +
            '&sortAsc=' +
            (options.sortAsc != null ? options.sortAsc : false)
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          catchError(() => of([])),
          tap((data) => {
            this.lastEmittedValue = data
            this.$fundings.next(data)
          }),
          switchMap((data) => this.$fundings.asObservable())
        )
        .subscribe()
    } else {
      this.getAndSortFundings(options)
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          tap((data) => {
            this.lastEmittedValue = data
            this.$fundings.next(data)
          }),
          switchMap((data) => this.$fundings.asObservable())
        )
        .subscribe()
    }
    return this.$fundings.asObservable()
  }

  getFundingDetails(putCode): Observable<Funding> {
    return this._http
      .get<Funding>(
        environment.API_WEB + `fundings/fundingDetails.json?id=${putCode}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
    /* TODO: Fetch group id info */
  }

  getPublicFundingDetails(orcid, putCode): Observable<any> {
    return this._http
      .get<Funding>(
        environment.API_WEB + orcid + `/fundingDetails.json?id=${putCode}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  changeUserRecordContext(userRecordContext: UserRecordOptions) {
    this.getFundings(userRecordContext).subscribe()
  }

  private getAndSortFundings(
    options: UserRecordOptions
  ): Observable<FundingGroup[]> {
    return this._http
      .get<FundingGroup[]>(
        environment.API_WEB +
          `fundings/fundingGroups.json?` +
          '&sort=' +
          (options.sort != null ? options.sort : 'date') +
          '&sortAsc=' +
          (options.sortAsc != null ? options.sortAsc : false)
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  set(value): Observable<FundingGroup[]> {
    throw new Error('Method not implemented.')
  }

  updateVisibility(
    putCode: string,
    visibility: VisibilityStrings
  ): Observable<any> {
    return this._http
      .get(
        environment.API_WEB +
          'fundings/' +
          putCode +
          '/visibility/' +
          visibility
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getFundings({ forceReload: true }))
      )
  }

  delete(putCode: string): Observable<any> {
    return this._http
      .delete(
        environment.API_WEB +
          'fundings/funding.json?id=' +
          encodeURIComponent(putCode)
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getFundings({ forceReload: true }))
      )
  }

  getFunding(): Observable<Funding> {
    return this._http
      .get<Funding>(environment.API_WEB + `fundings/funding.json`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  save(funding: Funding) {
    return this._http
      .post<Funding>(environment.API_WEB + `fundings/funding.json`, funding)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getFundings({ forceReload: true }))
      )
  }

  getOrganization(org: string): Observable<Organization[]> {
    return of([
      {
        sourceId: 'https://ror.org/01f80g185',
        country: 'CH',
        orgType: 'Government',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.CH',
        disambiguatedAffiliationIdentifier: '2132537',
        city: 'Geneva',
        sourceType: 'ROR',
        region: null,
        value: 'World Health Organization',
        url: null,
        affiliationKey: 'World Health Organization Geneva  CH',
      },
      {
        sourceId: 'https://ror.org/038ejm451',
        country: 'US',
        orgType: 'Nonprofit',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.US',
        disambiguatedAffiliationIdentifier: '2191119',
        city: 'Woodbridge',
        sourceType: 'ROR',
        region: 'Virginia',
        value: 'World Federation for Mental Health',
        url: null,
        affiliationKey:
          'World Federation for Mental Health Woodbridge Virginia US',
      },
      {
        sourceId: 'http://dx.doi.org/10.13039/100010829',
        country: 'FI',
        orgType: 'pri/Associations and societies (private and public)',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.FI',
        disambiguatedAffiliationIdentifier: '434969',
        city: null,
        sourceType: 'FUNDREF',
        region: null,
        value: 'World Association for Infant Mental Health',
        url: null,
        affiliationKey: 'World Association for Infant Mental Health   FI',
      },
      {
        sourceId: 'http://dx.doi.org/10.13039/100019461',
        country: 'US',
        orgType: 'gov/Research institutes and centers',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.US',
        disambiguatedAffiliationIdentifier: '2251765',
        city: 'OR',
        sourceType: 'FUNDREF',
        region: 'OR',
        value:
          'Oregon Institute of Occupational Health Sciences, Oregon Health and Science University',
        url: null,
        affiliationKey:
          'Oregon Institute of Occupational Health Sciences, Oregon Health and Science University OR OR US',
      },
      {
        sourceId: 'https://ror.org/01xmtfq82',
        country: 'US',
        orgType: 'Nonprofit',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.US',
        disambiguatedAffiliationIdentifier: '2176738',
        city: 'Portland',
        sourceType: 'ROR',
        region: 'Oregon',
        value: 'Northwest Health Foundation',
        url: null,
        affiliationKey: 'Northwest Health Foundation Portland Oregon US',
      },
      {
        sourceId: 'https://ror.org/009avj582',
        country: 'US',
        orgType: 'Education',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.US',
        disambiguatedAffiliationIdentifier: '2132660',
        city: 'Portland',
        sourceType: 'ROR',
        region: 'Oregon',
        value: 'Oregon Health & Science University',
        url: null,
        affiliationKey: 'Oregon Health & Science University Portland Oregon US',
      },
      {
        sourceId: 'http://dx.doi.org/10.13039/100013363',
        country: 'US',
        orgType: 'pri/Other non-profit organizations',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.US',
        disambiguatedAffiliationIdentifier: '1715498',
        city: 'CA',
        sourceType: 'FUNDREF',
        region: 'CA',
        value: 'Sutter Health',
        url: null,
        affiliationKey: 'Sutter Health CA CA US',
      },
      {
        sourceId: 'http://dx.doi.org/10.13039/100016634',
        country: 'US',
        orgType: 'pri/Other non-profit organizations',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.US',
        disambiguatedAffiliationIdentifier: '2108204',
        city: 'CO',
        sourceType: 'FUNDREF',
        region: 'CO',
        value: 'Vail Health',
        url: null,
        affiliationKey: 'Vail Health CO CO US',
      },
      {
        sourceId: 'http://dx.doi.org/10.13039/100016652',
        country: 'US',
        orgType: 'pri/Other non-profit organizations',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.US',
        disambiguatedAffiliationIdentifier: '2108222',
        city: 'NC',
        sourceType: 'FUNDREF',
        region: 'NC',
        value: 'Duke Health',
        url: null,
        affiliationKey: 'Duke Health NC NC US',
      },
      {
        sourceId: 'http://dx.doi.org/10.13039/100015201',
        country: 'US',
        orgType: 'pri/Other non-profit organizations',
        countryForDisplay:
          'org.orcid.persistence.jpa.entities.CountryIsoEntity.US',
        disambiguatedAffiliationIdentifier: '2094982',
        city: 'NY',
        sourceType: 'FUNDREF',
        region: 'NY',
        value: 'Oscar Health',
        url: null,
        affiliationKey: 'Oscar Health NY NY US',
      },
    ]).pipe(
      retry(3),
      catchError((error) => this._errorHandler.handleError(error))
    )
  }

  loadFundingImportWizardList(): Observable<RecordImportWizard[]> {
    return this._http.get<RecordImportWizard[]>(
      environment.API_WEB + 'workspace/retrieve-funding-import-wizards.json'
    )
  }

  updatePreferredSource(putCode: string): Observable<any> {
    return this._http
      .get(
        environment.API_WEB +
          'fundings/updateToMaxDisplay.json?putCode=' +
          putCode
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getFundings({ forceReload: true }))
      )
  }
}
