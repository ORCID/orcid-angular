import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, filter, map, retry, switchMap, tap } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
type Interstitials = 'DOMAIN_INTERSTITIAL'

@Injectable({
  providedIn: 'root',
})
export class InterstitialsService {
  constructor(
    private _userInfo: UserService,
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  setInterstitialsViewed(interstitial: Interstitials, updateDatabase = true) {
    return this._userInfo.getUserSession().pipe(
      tap((userInfo) => {
        const effectiveUser = userInfo?.userInfo?.EFFECTIVE_USER_ORCID
        localStorage.setItem(effectiveUser + '_' + interstitial, 'true')
      }),
      switchMap(() => {
        if (updateDatabase) {
          return this.addInterstitialFlag(interstitial)
        } else {
          return of(null)
        }
      })
    )
  }

  getInterstitialsViewed(interstitial: Interstitials): Observable<boolean> {
    return this._userInfo.getUserSession().pipe(
      filter((userInfo) => !!userInfo.userInfo),
      map((userInfo) => {
        const effectiveUser = userInfo?.userInfo?.EFFECTIVE_USER_ORCID
        if (interstitial === 'DOMAIN_INTERSTITIAL') {
          // This is a weird condition as we changed the localstorage value from OAUTH_DOMAIN_INTERSTITIAL to DOMAIN_INTERSTITIAL
          // This is a fix so DOMAIN_INTERSTITIAL is backwards compatible with OAUTH_DOMAIN_INTERSTITIAL
          return (
            localStorage.getItem(effectiveUser + '_DOMAIN_INTERSTITIAL') ===
              'true' ||
            localStorage.getItem(
              effectiveUser + '_OAUTH_DOMAIN_INTERSTITIAL'
            ) === 'true'
          )
        } else {
          return (
            localStorage.getItem(effectiveUser + '_' + interstitial) === 'true'
          )
        }
      }),
      // if there is no flag in local storage, check the server
      switchMap((hasFlag) => {
        if (hasFlag) {
          return of(true)
        } else {
          return this.hasInterstitialFlag(interstitial)
        }
      })
    )
  }

  private hasInterstitialFlag(
    interstitialName: Interstitials
  ): Observable<boolean> {
    return this._http
      .get<boolean>(
        `${runtimeEnvironment.API_WEB}account/hasInterstitialFlag/${interstitialName}`
      )
      .pipe(
        retry(3),
        switchMap((hasFlag) => {
          if (hasFlag) {
            return this.setInterstitialsViewed(interstitialName, false).pipe(
              map(() => hasFlag)
            )
          }
          return of(hasFlag)
        }),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  private addInterstitialFlag(interstitialName: string): Observable<void> {
    return this._http
      .post<void>(
        `${runtimeEnvironment.API_WEB}account/addInterstitialFlag`,
        interstitialName
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
