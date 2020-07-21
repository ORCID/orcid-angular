import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { forkJoin, merge, Observable, of, Subject, timer } from 'rxjs'
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
import { NameForm, UserInfo, OauthParameters } from 'src/app/types'
import { environment } from 'src/environments/environment'

import { UserStatus } from '../../types/userStatus.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { OauthService } from '../oauth/oauth.service'

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
  private $infoOnEachStatusUpdateObservable: Observable<{
    userInfo: UserInfo
    nameForm: NameForm
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

  getUserInfoOnEachStatusUpdate(): Observable<{
    userInfo: UserInfo
    nameForm: NameForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }> {
    // If an observable already exists, the same is shared between subscriptions
    // If not creates an observable
    if (this.$infoOnEachStatusUpdateObservable) {
      return this.$infoOnEachStatusUpdateObservable
    } else {
      return (this.$infoOnEachStatusUpdateObservable =
        // Every 30 seconds... or when recheck is trigger
        merge(timer(0, 30 * 1000), this._recheck).pipe(
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
          switchMap((loggedIn) => this.handleOauthSectionUpdate(loggedIn)),
          // At the very beginning assumes the user is logged in,
          // this is to avoid waiting for userStatus.json before calling userInfo.json and nameForm.json on the first load
          startWith(true),
          switchMap((loggedIn: boolean) => this.handleUserDataUpdate(loggedIn)),
          map((data: { userInfo: UserInfo; nameForm: NameForm }) =>
            this.computesUpdatedUserData(data)
          ),
          shareReplay(1)
        ))
    }
  }

  // computes loggedIn State, displayName and orcidUrl based on the data comming from
  // userInfo and nameForm endpoints
  private computesUpdatedUserData(data: {
    userInfo: UserInfo
    nameForm: NameForm
  }): {
    userInfo: UserInfo
    nameForm: NameForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
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

  // If the user is logged in get the UserStatus.json and nameForm.json
  private handleUserDataUpdate(
    loggedIn: boolean
  ): Observable<{} | { userInfo: UserInfo; nameForm: NameForm }> {
    this.currentlyLoggedIn = loggedIn
    if (loggedIn) {
      // return an object with the most recent response of both endpoints
      return forkJoin({
        userInfo: this.getUserInfo().pipe(this.handleErrors),
        nameForm: this.getNameForm().pipe(this.handleErrors),
      })
    }
    return of({})
  }

  // If the user status changes the Oauth section(if exist) needs  to be updated
  private handleOauthSectionUpdate(loggedIn: boolean): Observable<boolean> {
    return this._platform.get().pipe(
      switchMap((platform) => {
        if (platform.oauthMode) {
          return this._oauth
            .declareOauthSession(
              platform.queryParameters as OauthParameters,
              true
            )
            .pipe(map(() => loggedIn))
        } else {
          return of(loggedIn)
        }
      })
    )
  }

  refreshUserStatus() {
    this._recheck.next()
    return this.getUserInfoOnEachStatusUpdate().pipe(
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
