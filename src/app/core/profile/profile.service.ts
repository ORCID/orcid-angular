import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/internal/operators/catchError'
import { retry } from 'rxjs/internal/operators/retry'
import { map } from 'rxjs/operators'
import {
  Affiliations,
  AffiliationsDetails,
  AffiliationUIGroup,
  OrgDisambiguated,
  Person,
  Works,
} from 'src/app/types'
import { environment } from 'src/environments/environment'

import { AffiliationsGroupingService } from '../affiliations-grouping/affiliations-grouping.service'
import { AffiliationsSortService } from '../affiliations-sort/affiliations-sort.service'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _affiliationsGroupingService: AffiliationsGroupingService,
    private _affiliationsSortService: AffiliationsSortService
  ) {}

  getAffiliationsAndWorks(id): Observable<AffiliationUIGroup[]> {
    return this._http
      .get<Affiliations>(environment.API_WEB + `${id}/affiliationGroups.json`)
      .pipe(
        retry(3),
        map(data => this._affiliationsGroupingService.transform(data)),
        map(data => this._affiliationsSortService.transform(data)),
        catchError(this._errorHandler.handleError)
      )
  }

  getWorks(id: string): Observable<Works> {
    const offset = '0'
    const sort = 'date'
    const sortAsc = 'false'
    return this._http
      .get<Works>(
        environment.API_WEB +
          `${id}/worksPage.json?offset=${offset}&sort=${sort}&sortAsc=${sortAsc}`
      )
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }

  getPerson(id): Observable<Person> {
    return this._http
      .get<Person>(environment.API_WEB + `${id}/person.json`)
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }

  getOrgDisambiguated(type, value): Observable<OrgDisambiguated> {
    if (type && value) {
      return this._http.get<OrgDisambiguated>(
        environment.API_WEB +
          `orgs/disambiguated/${type}?value=${encodeURIComponent(value)}`
      )
    } else {
      return of(null)
    }
  }

  getAffiliationDetails(id, type, value): Observable<AffiliationsDetails> {
    return this._http.get<AffiliationsDetails>(
      environment.API_WEB +
        `${id}/affiliationDetails.json?id=${value}&type=${type}`
    )
  }
}
