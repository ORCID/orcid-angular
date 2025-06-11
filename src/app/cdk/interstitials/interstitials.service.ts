import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
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
import { CookieService } from 'ngx-cookie-service'
import { LOCAL_SESSION_UID } from 'src/app/constants'
import { WINDOW } from '../window'
import { QaFlagsService } from 'src/app/core/qa-flag/qa-flag.service'
import { QaFlag } from 'src/app/core/qa-flag/qa-flags.enum'

@Injectable({
  providedIn: 'root',
})
export class InterstitialsService {
  private readonly INTERSTITIAL_SESSION_KEY =
    'SESSION-ALREADY-CHECKED-INTERSTITIAL'

  constructor(
    private _userInfo: UserService,
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private cookiesService: CookieService,
    @Inject(WINDOW) private _window: Window,
    private _qaFlag: QaFlagsService
  ) {}

  setInterstitialsViewed(
    interstitial: InterstitialType,
    updateDatabase = true
  ): Observable<void> {
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

  /**
   * Stores the current session UID in session storage, indicating
   * that we no longer need to check interstitials logic for this session.
   */
  markCurrentSessionToNoCheckInterstitialsLogic(): void {
    window.sessionStorage.setItem(
      this.INTERSTITIAL_SESSION_KEY,
      this._window.sessionStorage.getItem(LOCAL_SESSION_UID) || ''
    )
  }

  /**
   * Checks if the current session value is stored in session storage.
   * If it is, it means we don't need to check interstitials logic for this session.
   */
  checkIfSessionAlreadyCheckedInterstitialsLogic(): boolean {
    if (
      this._qaFlag.isFlagEnabled(QaFlag.forceInterstitialCheckOnEveryReload)
    ) {
      return false
    }

    const sessionValue = this._window.sessionStorage.getItem(
      this.INTERSTITIAL_SESSION_KEY
    )
    const currentSessionValue =
      this._window.sessionStorage.getItem(LOCAL_SESSION_UID)

    if (sessionValue === currentSessionValue) {
      return true
    } else {
      return false
    }
  }
}
