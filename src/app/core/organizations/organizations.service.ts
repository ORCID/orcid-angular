import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { WHITE_SPACE_REGEXP } from 'src/app/constants'
import { OrgDisambiguated } from 'src/app/types'

import { environment } from '../../../environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

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
}
