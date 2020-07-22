import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  forkJoin,
  merge,
  Observable,
  of,
  Subject,
  timer,
  combineLatest,
} from 'rxjs'
import {
  catchError,
  delay,
  filter,
  last,
  map,
  retry,
  retryWhen,
  shareReplay,
  startWith,
  switchMap,
  switchMapTo,
  take,
  tap,
} from 'rxjs/operators'
import {
  NameForm,
  UserInfo,
  OauthParameters,
  RequestInfoForm,
} from 'src/app/types'
import { environment } from 'src/environments/environment'

import { UserStatus } from '../../types/userStatus.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { OauthService } from '../oauth/oauth.service'
import { Params } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _platform: PlatformInfoService,
    private _oauth: OauthService
  ) {}
  private currentlyLoggedIn: boolean
  private loggingStateComesFromTheServer = false
  private $userSessionObservable: Observable<{
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }>

  private readonly _recheck = new Subject<void>()
  private readonly _stop = new Subject<void>()
  private readonly _start = new Subject<void>()
  private bypassStatusNotChangeFilter = false

  private getUserInfo(): Observable<UserInfo> {
    return this._http.get<UserInfo>(environment.API_WEB + 'userInfo.json', {
      withCredentials: true,
    })
  }

  public getUserStatus() {
    return this._http
      .get<UserStatus>(environment.API_WEB + 'userStatus.json', {
        withCredentials: true,
      })
      .pipe(map((response) => response.loggedIn || null))
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  private getNameForm(): Observable<NameForm> {
    return this._http.get<NameForm>(
      environment.API_WEB + 'account/nameForm.json',
      {
        withCredentials: true,
      }
    )
  }

  /**
   * @param queryParams overwrite query parameters provided by the platform service. Used when the call comes from a Guard
   * since the query params are not yet available on the platform service.
   *
   * At the start, every 30 seconds and when the method `refreshUserStatus()` is called
   * the user login status will be check and if it has changed
   * the following actions will be taken
   * - update the backend OAuth  section (if exists)
   * - retrieve user session updated data
   *
   * @returns a hot observable with the user section information
   */
  getUserSession(
    queryParams?: Params
  ): Observable<{
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }> {
    // If an observable already exists, the same is shared between subscriptions
    // If not creates an observable
    if (this.$userSessionObservable) {
      return this.$userSessionObservable
    } else {
      return (this.$userSessionObservable =
        // Every 30 seconds... or when recheck is trigger
        merge(timer(0, 4 * 1000), this._recheck).pipe(
          // Check for updates on userStatus.json
          switchMapTo(this.getUserStatus()),
          // Filter followup calls if the user status has no change
          //
          // Also turns on the flag loggingStateComesFromTheServer
          // indicating that the current logging state is taken from the server,
          // and not the initial assumption. (more on this on the following pipe)
          filter((loggedIn) => {
            this.loggingStateComesFromTheServer = true
            if (!(loggedIn === this.currentlyLoggedIn)) {
              return true
            }
            return false
          }),
          // At the very beginning assumes the user is logged in,
          // this is to avoid waiting for userStatus.json before calling userInfo.json and nameForm.json on the first load
          startWith(true),
          switchMap((loggedIn: boolean) =>
            this.handleUserDataUpdate(loggedIn, queryParams)
          ),
          map(
            (data: {
              userInfo: UserInfo
              nameForm: NameForm
              oauthSession: RequestInfoForm
            }) => this.computesUpdatedUserData(data)
          ),
          tap((session) => console.log(session)),
          shareReplay(1)
        ))
    }
  }

  /**
   * computes loggedIn State, displayName, and orcidUrl based on the data coming from
   * userInfo and nameForm endpoints
   **/

  private computesUpdatedUserData(data: {
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
  }): {
    userInfo: UserInfo
    nameForm: NameForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
    oauthSession: RequestInfoForm
  } {
    {
      return {
        ...data,
        ...{
          loggedIn: !!data.userInfo || !!data.nameForm,
          displayName: this.getDisplayName(data.nameForm),
          orcidUrl:
            'https:' + environment.BASE_URL + data && data.userInfo
              ? data.userInfo.REAL_USER_ORCID
              : '',
        },
      }
    }
  }

  /**
   * @param  loggedIn true if the user is login, please note that getUserSession will eagerly call this as true on the app first load
   * @param  queryParams overwrite query parameters provided by the platform service
   *
   * calls the appropriated endpoints depending on the logging state
   *
   * @returns an observable that with the last response of the calls,
   * this observable will wait for all the calls to respond before returning the first event
   */
  private handleUserDataUpdate(
    loggedIn: boolean,
    queryParams?: Params
  ): Observable<
    | {}
    | {
        userInfo?: UserInfo
        nameForm?: NameForm
        oauthSession: RequestInfoForm
      }
  > {
    this.currentlyLoggedIn = loggedIn
    const $userInfo = this.getUserInfo().pipe(this.handleErrors)
    const $nameForm = this.getNameForm().pipe(this.handleErrors)
    const $oauthSession = this.getOauthSession(queryParams).pipe()

    if (loggedIn) {
      return combineLatest([$userInfo, $nameForm, $oauthSession]).pipe(
        map(([userInfo, nameForm, oauthSession]) => ({
          userInfo,
          nameForm,
          oauthSession,
        }))
      )
    } else {
      return forkJoin([$oauthSession]).pipe(
        map(([oauthSession]) => ({
          oauthSession,
        }))
      )
    }
  }
  /**
   * @param  queryParams? overwrite query parameters provided by the platform service
   */
  private getOauthSession(queryParams?: Params): Observable<RequestInfoForm> {
    return this._platform.get().pipe(
      take(1),
      switchMap((platform) => {
        console.log(
          'try to use this Oauth parameters to declare the session ',
          queryParams || platform.queryParameters
        )
        if (
          (queryParams && Object.keys(queryParams).length) ||
          (platform.oauthMode && Object.keys(platform.oauthMode).length)
        ) {
          return this._oauth.declareOauthSession(
            (queryParams as OauthParameters) ||
              (platform.queryParameters as OauthParameters),
            true
          )
        } else {
          return of(undefined)
        }
      })
    )
  }

  refreshUserStatus() {
    this._recheck.next()
    return this.getUserSession().pipe(
      // ignore the replay value, and return the latest value
      take(2),
      last()
    )
  }

  private getDisplayName(nameForm: NameForm): string {
    if (nameForm != null) {
      if (
        nameForm.creditName &&
        nameForm.creditName.value &&
        nameForm.creditName.value.length
      ) {
        return nameForm.creditName.value
      } else {
        return (
          ((nameForm.givenNames && nameForm.givenNames.value) || ' ') +
          ' ' +
          ((nameForm.familyName && nameForm.familyName.value) || ' ')
        )
      }
    } else {
      return null
    }
  }
  private handleErrors(gerUserInfo: Observable<UserInfo | NameForm>) {
    return (
      gerUserInfo
        .pipe(
          // If UserInfo.json or nameForm.json give an error it retries only if the user is currently logged in
          //
          // This is necessary because in some cases when the userStatus.json responded with { logging = true }
          // and the userInfo.json is called immediately after it responds with an error
          retryWhen((errors) =>
            errors.pipe(delay(2000)).pipe(
              tap((x) => {
                if (
                  !(
                    this.currentlyLoggedIn &&
                    this.loggingStateComesFromTheServer
                  )
                ) {
                  throw new Error()
                }
              })
            )
          )
        )
        // This is necessary since the backend responds with a CORS error when a
        // user is not logged in and userInfo.json is called
        .pipe(catchError((error) => of(null)))
    )
  }
}
