import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { OrgDisambiguated } from 'src/app/types'

import { environment } from '../../../environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  GRID_BASE_URL: string
  TEST_BASE_URL: string
  ISNI_BASE_URL: string

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {
    this.GRID_BASE_URL = 'https://www.grid.ac/institutes/'
    this.TEST_BASE_URL = 'https://orcid.org/'
    this.ISNI_BASE_URL = 'https://isni.org/isni/'
  }

  getOrgDisambiguated(type, value): Observable<OrgDisambiguated> {
    if (type && value) {
      return this._http
        .get<OrgDisambiguated>(
          environment.API_WEB +
            `orgs/disambiguated/${type}?value=${encodeURIComponent(value)}`
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error))
        )
    } else {
      return of(null)
    }
  }

  getLink(type: string, value: string): string {
    switch (type.toUpperCase()) {
      case 'TEST':
        return this.TEST_BASE_URL + value
      case 'GRID':
        return this.GRID_BASE_URL + value
      case 'ISNI':
        return this.ISNI_BASE_URL + value
      case 'ROR':
        return value
      default:
        return ''
    }
  }
}
