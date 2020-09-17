import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Params } from '@angular/router'
import {
  combineLatest,
  merge,
  Observable,
  of,
  ReplaySubject,
  Subject,
  timer,
} from 'rxjs'
import {
  catchError,
  delay,
  filter,
  first,
  last,
  map,
  retry,
  retryWhen,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'

import {
  NameForm,
  OauthParameters,
  RequestInfoForm,
  UserInfo,
} from 'src/app/types'
import { environment } from 'src/environments/environment'

import { UserStatus } from '../../types/userStatus.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { OauthService } from '../oauth/oauth.service'
import { ERROR_REPORT } from 'src/app/errors'
import { UserSession } from 'src/app/types/session.local'

interface UserSessionUpdateParameters {
  checkTrigger:
    | number
    | { forceSessionUpdate: boolean; postLoginUpdate: boolean }
  loggedIn: boolean
}

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
  private $userSessionSubject = new ReplaySubject<UserSession>(1)
  sessionInitialized = false

  _recheck = new Subject<{
    forceSessionUpdate: boolean
    postLoginUpdate: boolean
  }>()

  private getUserInfo(): Observable<UserInfo> {
    return this._http.get<UserInfo>(environment.API_WEB + 'userInfo.json', {
      withCredentials: true,
    })
  }

  public getUserStatus(): Observable<boolean> {
    return this._http
      .get<UserStatus>(environment.API_WEB + 'userStatus.json', {
        withCredentials: true,
      })
      .pipe(map((response) => !!response.loggedIn))
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
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
   * At the start, every 30 seconds and when the method `refreshUserSession()` is called
   * the user login status will be check and if it has changed
   * the following actions will be taken
   * - update the backend OAuth  session (if exists)
   * - retrieve user session updated data
   *
   * @returns a hot observable with the user session information
   */
  getUserSession(queryParams?: Params): Observable<UserSession> {
    // If an observable already exists, the same is shared between subscriptions
    // If not creates an observable
    if (this.sessionInitialized) {
      return this.$userSessionSubject
    } else {
      this.sessionInitialized = true
      // trigger every 30 seconds or on _recheck subject event
      merge(timer(0, 30 * 1000), this._recheck)
        .pipe(
          // Check for updates on userStatus.json
          switchMap((checkTrigger) =>
            this.getUserStatus().pipe(
              map((loggedIn) => {
                return { checkTrigger, loggedIn }
              })
            )
          ),
          // Filter followup calls if the user status has no change
          //
          // Also turns on the flag loggingStateComesFromTheServer
          // indicating that the current logging state is taken from the server,
          // and not the initial assumption. (more on this on the following pipe)
          filter((result) => {
            this.loggingStateComesFromTheServer = true
            return this.userStatusHasChange(result)
          }),
          // At the very beginning assumes the user is logged in,
          // this is to avoid waiting for userStatus.json before calling userInfo.json and nameForm.json on the first load
          startWith({ loggedIn: true, checkTrigger: -1 }),
          switchMap((updateParameters) =>
            this.handleUserDataUpdate(updateParameters, queryParams)
          ),
          map((data) => this.computesUpdatedUserData(data)),
          // Debugger for the user session on development time
          tap((session) =>
            environment.sessionDebugger ? console.log(session) : null
          ),
          tap((session) => {
            this.$userSessionSubject.next(session)
          })
        )
        .subscribe()
      return this.$userSessionSubject
    }
  }

  private userStatusHasChange(updateParameters: UserSessionUpdateParameters) {
    if (
      !(updateParameters.loggedIn === this.currentlyLoggedIn) ||
      (typeof updateParameters.checkTrigger !== `number` &&
        updateParameters.checkTrigger.forceSessionUpdate)
    ) {
      return true
    } else {
      return false
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
  }): UserSession {
    {
      return {
        ...data,
        ...{
          loggedIn: !!data.userInfo || !!data.nameForm,
          displayName: this.getDisplayName(data.nameForm),
          orcidUrl: this.getOrcidUrl(data),
          effectiveOrcidUrl: this.getOrcidUrl(data, true),
        },
      }
    }
  }
  private getOrcidUrl(
    data: {
      userInfo: UserInfo
      nameForm: NameForm
      oauthSession: RequestInfoForm
    },
    effectiveId = false
  ): string {
    if (data && data.userInfo) {
      const orcidId = effectiveId
        ? data.userInfo.EFFECTIVE_USER_ORCID
        : data.userInfo.REAL_USER_ORCID
      if (orcidId) {
        return 'https:' + environment.BASE_URL + orcidId
      }
    }
    return undefined
  }

  /**
   * @param  updateParameters login status and trigger information
   * @param  queryParams overwrite query parameters provided by the platform service
   *
   * calls the appropriated endpoints depending on the logging state
   *
   * @returns an observable that with the last response of the calls,
   * this observable will wait for all the calls to respond before returning the first event
   */
  private handleUserDataUpdate(
    updateParameters?: UserSessionUpdateParameters,
    queryParams?: Params
  ): Observable<{
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
  }> {
    this.currentlyLoggedIn = updateParameters.loggedIn
    const $userInfo = this.getUserInfo().pipe(this.handleErrors)
    const $nameForm = this.getNameForm().pipe(this.handleErrors)
    const $oauthSession = this.getOauthSession(
      updateParameters,
      queryParams as OauthParameters
    )
    if (updateParameters.loggedIn) {
      return combineLatest([$userInfo, $nameForm, $oauthSession]).pipe(
        map(([userInfo, nameForm, oauthSession]) => ({
          userInfo,
          nameForm,
          oauthSession,
        }))
      )
    } else {
      return combineLatest([of(undefined), of(undefined), $oauthSession]).pipe(
        map(([userInfo, nameForm, oauthSession]) => ({
          userInfo,
          nameForm,
          oauthSession,
        }))
      )
    }
  }
  /**
   * @param  queryParams? overwrite query parameters provided by the platform service
   */
  private getOauthSession(
    updateParameters?: UserSessionUpdateParameters,
    queryParams?: OauthParameters
  ): Observable<RequestInfoForm> {
    return this._platform.get().pipe(
      first(),
      switchMap((platform) => {
        if (
          (queryParams && Object.keys(queryParams).length) ||
          (platform.oauthMode && Object.keys(platform.oauthMode).length)
        ) {
          const params =
            queryParams || (platform.queryParameters as OauthParameters)
          // After a user login remove the promp parameter
          if (
            typeof updateParameters.checkTrigger !== `number` &&
            updateParameters.checkTrigger.postLoginUpdate
          ) {
            delete params.prompt
          }
          if (typeof updateParameters.checkTrigger === `number` && updateParameters.checkTrigger === -1) {
            return of(undefined)
          }
          return this._oauth.declareOauthSession(params)
        } else {
          return of(undefined)
        }
      })
    )
  }

  /**
   * @param forceSessionUpdate=false set to true if the user session should be updated even when the user status does not change
   * @param postLoginUpdate=false set to true for the `prompt` parameter to be removed from the Oauth session
   */
  refreshUserSession(forceSessionUpdate = false, postLoginUpdate = false) {
    this._recheck.next({ forceSessionUpdate, postLoginUpdate })
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
      return undefined
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
                  throw new Error('currentlyLoggedInWithErrors')
                }
              })
            )
          )
        )
        // This is necessary since the backend responds with a CORS error when a
        // user is not logged in and userInfo.json is called

        // TODO @angel we need to avoid sending HTTP errors back from the backend on this scenario
        // so we can better interpret real errors here
        .pipe(catchError((error) => of(null)))
    )
  }
}
