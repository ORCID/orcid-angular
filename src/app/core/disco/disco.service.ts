import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, first, map, retry, shareReplay } from 'rxjs/operators'

import { environment } from '../../../environments/environment'
import { Institutional } from '../../types/institutional.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { ERROR_REPORT } from 'src/app/errors'

@Injectable({
  providedIn: 'root',
})
export class DiscoService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getInstitutionsNames(institutions, filterInput?: string): string[] {
    const allInstitutionNames = this.getDiscoFeedInstitutionsNames(institutions)
    let institutionNames: string[]
    if (filterInput && filterInput.length > 0) {
      institutionNames = allInstitutionNames.filter((institutionName) => {
        institutionName = institutionName.toLowerCase()
        filterInput = filterInput.toLocaleLowerCase()
        return institutionName.indexOf(filterInput.toLowerCase()) !== -1
      })
      institutionNames = institutionNames.slice(
        0,
        environment.INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT
      )
    } else {
      institutionNames = allInstitutionNames
    }

    return institutionNames
  }

  getInstitutionBaseOnName(
    institutionName: string,
    allInstitutions: Institutional[]
  ): Institutional {
    institutionName = institutionName.toLowerCase()
    return allInstitutions.find((institution) =>
      institution?.DisplayNames?.find(
        (name) =>
          name.lang === 'en' &&
          name.value.toLocaleLowerCase() === institutionName
      )
    )
  }

  getInstitutionBaseOnID(entityId: string): Observable<Institutional> {
    return this.getDiscoFeed().pipe(
      first(),
      map((institutions) => {
        return institutions.find(
          (institution) => institution?.entityID === entityId
        )
      })
    )
  }

  public getDiscoFeed(): Observable<Institutional[]> {
    return this._http
      .get<Institutional[]>(environment.BASE_URL + 'Shibboleth.sso/DiscoFeed')
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        ),
        shareReplay(1)
      )
  }

  private getDiscoFeedInstitutionsNames(allInstitutions): string[] {
    return this.discoFeedToInstitutionNames(allInstitutions)
  }

  private discoFeedToInstitutionNames(institutions: Institutional[]): string[] {
    const names = []
    institutions.map((inst) =>
      inst.DisplayNames.filter((name) => name.lang === 'en').map((en) =>
        names.push(en.value)
      )
    )
    return names
  }
}
