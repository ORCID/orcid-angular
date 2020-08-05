import { Injectable } from '@angular/core'
import { Observable, of, interval } from 'rxjs'
import {
  pluck,
  share,
  shareReplay,
  tap,
  map,
  switchMap,
  throttle,
} from 'rxjs/operators'

import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Institutional } from '../../types/institutional.endpoint'
import { catchError, retry } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { discoFeed } from './disco'

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
        if (filterInput && filterInput.length > 2) {
          institutionNames = value.filter((institutionName) => {
            institutionName = institutionName.toLowerCase()
            filterInput = filterInput.toLocaleLowerCase()
            return institutionName.indexOf(filterInput.toLowerCase()) === 0
          })
          console.log(institutionNames)
        } else {
          institutionNames = value
          console.log(institutionNames)
        }
        institutionNames = institutionNames.slice(
          0,
          environment.INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT
        )

        return of(institutionNames)
      })
    )
  }

  private getDiscoFeed(): Observable<Institutional[]> {
    // return this._http
    //   .get<Institutional[]>(environment.BASE_URL + 'Shibboleth.sso/DiscoFeed')
    //   .pipe(
    //     retry(3),
    //     catchError((error) => this._errorHandler.handleError(error)),
    //     shareReplay(1)
    //   )
    return of(discoFeed).pipe(shareReplay(1))
  }

  private getDiscoFeedInstitutionsNames(): Observable<string[]> {
    return this.getDiscoFeed().pipe(
      map((value: Institutional[]) => this.discoFeedToInstitutionNames(value)),
      shareReplay(1)
    )
  }

  discoFeedToInstitutionNames(institutions: Institutional[]): string[] {
    const names = []
    institutions.map((inst) =>
      inst.DisplayNames.filter(
        (subElement) => subElement.lang === 'en'
      ).map((en) => names.push(en.value))
    )
    return names
  }
}
