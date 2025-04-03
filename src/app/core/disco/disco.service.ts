import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, first, map, retry, take, tap } from 'rxjs/operators'

import { Institutional } from '../../types/institutional.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { ERROR_REPORT } from 'src/app/errors'

@Injectable({
  providedIn: 'root',
})
export class DiscoService {
  discoFeedSubject: ReplaySubject<Institutional[]>
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
        runtimeEnvironment.INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT
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
      map((value) => this.getInstitutionBaseOnIDFromObject(value, entityId))
    )
  }
  getInstitutionBaseOnIDFromObject(
    institutions: Institutional[],
    entityId: string
  ): Institutional | undefined {
    return institutions.find(
      (institution) => institution?.entityID === entityId
    )
  }

  getInstitutionNameBaseOnId(entityId): Observable<string> {
    return this.getInstitutionBaseOnID(entityId).pipe(
      map((value) => this.getInstitutionNameBaseOnIdFromObject(value))
    )
  }

  getInstitutionNameBaseOnIdFromObject(
    institution: Institutional | undefined
  ): string | undefined {
    return institution?.DisplayNames?.filter(
      (subElement) => subElement.lang === 'en'
    ).map((en) => {
      return en.value
    })?.[0]
  }

  public getDiscoFeed(): Observable<Institutional[]> {
    if (!this.discoFeedSubject) {
      this.discoFeedSubject = new ReplaySubject(1)
      return this._http
        .get<Institutional[]>(
          runtimeEnvironment.BASE_URL + 'Shibboleth.sso/DiscoFeed'
        )
        .pipe(
          tap((feed) => {
            this.discoFeedSubject.next(feed)
          }),
          retry(3),
          catchError((error) =>
            this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
          )
        )
    }
    {
      return this.discoFeedSubject.pipe(take(1))
    }
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
