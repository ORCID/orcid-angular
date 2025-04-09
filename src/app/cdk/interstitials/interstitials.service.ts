import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import {
  catchError,
  filter,
  map,
  retry,
  switchMap,
  take,
  tap,
} from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { InterstitialType } from './interstitial.type'

@Injectable({
  providedIn: 'root',
})
export class InterstitialsService {
  constructor(
    private _userInfo: UserService,
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  setInterstitialsViewed(
    interstitial: InterstitialType,
    updateDatabase = true
  ) {
    return this._userInfo.getUserSession().pipe(
      filter((userInfo) => !!userInfo.userInfo),
      take(1),
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

  getInterstitialsViewed(interstitial: InterstitialType): Observable<boolean> {
    return this._userInfo.getUserSession().pipe(
      filter((userInfo) => !!userInfo.userInfo),
      take(1),
      map((userInfo) => {
        const effectiveUser = userInfo?.userInfo?.EFFECTIVE_USER_ORCID
        return (
          localStorage.getItem(effectiveUser + '_' + interstitial) === 'true'
        )
      }),
      // if there is no flag in local storage, check the server
      switchMap((hasFlag) => {
        if (hasFlag) {
          return of(true)
        } else {
          console.log('calls the server for ', interstitial)
          return this.hasInterstitialFlag(interstitial)
        }
      })
    )
  }

  private hasInterstitialFlag(
    interstitialName: InterstitialType
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
