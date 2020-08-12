import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import {
  catchError,
  first,
  map,
  retry,
  shareReplay,
  switchMap,
} from 'rxjs/operators'

import { environment } from '../../../environments/environment'
import { Institutional } from '../../types/institutional.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { STANDARD_ERROR_REPORT } from 'src/app/errors'

@Injectable({
  providedIn: 'root',
})
export class DiscoService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getInstitutionsNames(filterInput?: string): Observable<string[]> {
    return this.getDiscoFeedInstitutionsNames().pipe(
      switchMap((value) => {
        let institutionNames: string[]
        if (filterInput && filterInput.length > 0) {
          institutionNames = value.filter((institutionName) => {
            institutionName = institutionName.toLowerCase()
            filterInput = filterInput.toLocaleLowerCase()
            return institutionName.indexOf(filterInput.toLowerCase()) === 0
          })
          institutionNames = institutionNames.slice(
            0,
            environment.INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT
          )
        } else {
          institutionNames = value
        }

        return of(institutionNames)
      })
    )
  }

  getInstitutionBaseOnName(institutionName: string): Observable<Institutional> {
    institutionName = institutionName.toLowerCase()
    return this.getDiscoFeed().pipe(
      first(),
      map((institutions) => {
        return institutions.find((institution) =>
          institution?.DisplayNames?.find(
            (name) =>
              name.lang === 'en' &&
              name.value.toLocaleLowerCase() === institutionName
          )
        )
      })
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

  private getDiscoFeed(): Observable<Institutional[]> {
    return this._http
      .get<Institutional[]>(environment.BASE_URL + 'Shibboleth.sso/DiscoFeed')
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, STANDARD_ERROR_REPORT)
        ),
        shareReplay(1)
      )
  }

  private getDiscoFeedInstitutionsNames(): Observable<string[]> {
    return this.getDiscoFeed().pipe(
      map((institutions: Institutional[]) =>
        this.discoFeedToInstitutionNames(institutions)
      ),
      shareReplay(1)
    )
  }

  discoFeedToInstitutionNames(institutions: Institutional[]): string[] {
    const names = []
    institutions.map((inst) =>
      inst.DisplayNames.filter((name) => name.lang === 'en').map((en) =>
        names.push(en.value)
      )
    )
    return names
  }
}
