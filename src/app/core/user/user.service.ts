import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import {
  BehaviorSubject,
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
  takeUntil,
  tap,
} from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { ERROR_REPORT } from 'src/app/errors'
import {
  NameForm,
  OauthParameters,
  RequestInfoForm,
  UserInfo,
} from 'src/app/types'
import {
  UserSession,
  UserSessionUpdateParameters,
} from 'src/app/types/session.local'
import { ThirdPartyAuthData } from 'src/app/types/sign-in-data.endpoint'
import { Delegator } from 'src/app/types/trusted-individuals.endpoint'
import { environment } from 'src/environments/environment'

import { UserStatus } from '../../types/userStatus.endpoint'
import { DiscoService } from '../disco/disco.service'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { OauthService } from '../oauth/oauth.service'
import { UserInfoService } from '../user-info/user-info.service'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _platform: PlatformInfoService,
    private _oauth: OauthService,
    private _disco: DiscoService,
    private _userInfo: UserInfoService,
    @Inject(WINDOW) private window: Window,
  ) {}
  $userStatusChecked = new ReplaySubject()
  private currentlyLoggedIn: boolean
  private loggingStateComesFromTheServer = false
  private $userSessionSubject = new ReplaySubject<UserSession>(1)
  sessionInitialized = false
  keepRefreshingUserSession = true
  private hiddenTab = false
  private START_IMMEDIATELY_AND_CHECK_EVERY_TWENTY_FIVE_MINUTES = {
    start: 0,
    interval: 60 * 1000 * 25,
  }
  private START_IN_TWENTY_FIVE_MINUTES_AND_CHECK_EVERY_TWENTY_FIVE_MINUTES = {
    start: 60 * 1000 * 25,
    interval: 60 * 1000 * 25,
  }
  private interval$: BehaviorSubject<{
    start: number
    interval: number
  }> = new BehaviorSubject<{ start: number; interval: number }>(
    this.START_IMMEDIATELY_AND_CHECK_EVERY_TWENTY_FIVE_MINUTES
  )
  private reset$ = new Subject()

  _recheck = new Subject<{
    forceSessionUpdate: boolean
    postLoginUpdate: boolean
  }>()

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
   * At the start, every 60 seconds and when the method `refreshUserSession()` is called
   * the user login status will be check and if it has changed
   * the following actions will be taken
   * - update the backend OAuth  session (if exists)
   * - retrieve user session updated data
   *
   * @returns a hot observable with the user session information
   */
  getUserSession(): Observable<UserSession> {
    // If an observable already exists, the same is shared between subscriptions
    // If not creates an observable
    if (this.sessionInitialized) {
      return this.$userSessionSubject
    } else {
      this.sessionInitialized = true
      // trigger every 60 seconds if tab active  or  every 5 minutes  if tab hidden or
      // on _recheck subject event
      this.interval$.subscribe((timerVars) => {
        merge(
          timer(timerVars.start, timerVars.interval).pipe(
            takeUntil(this.reset$),
            map((timerUpdate) => {
              return { timerUpdate }
            })
          ),
          this._recheck
        )
          .pipe(
            // Check user status only when needed
            filter((value) => this.keepRefreshingUserSession),
            // Check for updates on userStatus.json
            switchMap((checkTrigger) => {
              this.$userStatusChecked.next(null)
              return this.getUserStatus().pipe(
                map((loggedIn) => {
                  return { loggedIn, checkTrigger }
                })
              )
            }),
            // Filter followup calls if the user status has no change
            //
            // Also turns on the flag loggingStateComesFromTheServer
            // indicating that the current logging state is taken from the server,
            // and not the initial assumption. (more on this on the following pipe)
            filter((result: UserSessionUpdateParameters) => {
              this.loggingStateComesFromTheServer = true
              return this.userStatusHasChange(result)
            }),

            // When the user lands on the Orcid app:
            // Take a eager approach:
            // create a trigger that just assumes the user es logging.
            // So instead of waiting until `userStatus` responds, at the very beginning of the app initialization
            // calling userInfo.json, nameForm.json
            // (this avoid unnecessary extra waiting for logged in users)
            //
            // When the user change tabs:
            // Take a lazy approach:
            // and empty trigger will be created, to not call the any endpoint until the next `userStatus` call responds.

            startWith(
              !this.loggingStateComesFromTheServer
                ? { loggedIn: true, checkTrigger: { timerUpdate: -1 } }
                : {}
            ),
            // Ignore empty triggers.
            filter(
              (trigger: UserSessionUpdateParameters) =>
                trigger.checkTrigger !== undefined
            ),

            switchMap((updateParameters: UserSessionUpdateParameters) => {
              if (updateParameters) {
                return this.handleUserDataUpdate(updateParameters)
              }
            }),
            map((data) => this.computesUpdatedUserData(data)),
            // Debugger for the user session on development time
            tap((session) =>
              environment.debugger ? console.debug(session) : null
            ),
            tap((session) => {
              this.$userSessionSubject.next(session)
            })
          )
          .subscribe()
      })

      return this.$userSessionSubject.asObservable()
    }
  }

  private userStatusHasChange(updateParameters: UserSessionUpdateParameters) {
    if (
      !(updateParameters.loggedIn === this.currentlyLoggedIn) ||
      updateParameters.checkTrigger.forceSessionUpdate
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
    thirdPartyAuthData: ThirdPartyAuthData
  }): UserSession {
    {
      return {
        ...data,
        ...{
          loggedIn: !!data.userInfo || !!data.nameForm,
          displayName: this.getDisplayName(data.nameForm),
          orcidUrl: this.getOrcidUrl(data),
          effectiveOrcidUrl: this.getOrcidUrl(data, true),
          oauthSessionIsLoggedIn:
            !!data.oauthSession &&
            !!data.oauthSession.userOrcid &&
            !!data.oauthSession.userName,
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
   *
   * calls the appropriated endpoints depending on the logging state
   *
   * @returns an observable that with the last response of the calls,
   * this observable will wait for all the calls to respond before returning the first event
   */
  private handleUserDataUpdate(
    updateParameters?: UserSessionUpdateParameters
  ): Observable<{
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    thirdPartyAuthData: ThirdPartyAuthData
  }> {
    this.currentlyLoggedIn = updateParameters.loggedIn
    const $userInfo = this._userInfo.getUserInfo().pipe(this.handleErrors)
    const $nameForm = this.getNameForm().pipe(this.handleErrors)
    const $oauthSession = this.getOauthSession(updateParameters)
    const $thirdPartyAuthData = this.getThirdPartySignInData()

    return combineLatest([
      updateParameters.loggedIn ? $userInfo : of(undefined),
      updateParameters.loggedIn ? $nameForm : of(undefined),
      $oauthSession,
      !updateParameters.loggedIn ? $thirdPartyAuthData : of(undefined),
    ]).pipe(
      map(([userInfo, nameForm, oauthSession, thirdPartyAuthData]) => ({
        userInfo,
        nameForm,
        oauthSession,
        thirdPartyAuthData,
      }))
    )
  }
  /**
   * @param updateParameters login status and trigger information
   */
  private getOauthSession(
    updateParameters?: UserSessionUpdateParameters
  ): Observable<RequestInfoForm> {
    return this._platform.get().pipe(
      first(),
      switchMap((platform) => {
        // Declare the oauth session on the backend
        if (platform.hasOauthParameters) {
          let params = platform.queryParameters as OauthParameters
          // After a user login or register while being login remove the promp parameter
          // TODO @leomendoza123 how is this handle by signin logins?
          if (updateParameters.checkTrigger.postLoginUpdate) {
            params = { ...params, prompt: undefined }
          }
          return this._oauth.declareOauthSession(params, updateParameters).pipe(
            tap((session) => (this.keepRefreshingUserSession = !session.error)),
            tap(() =>
              environment.debugger
                ? console.debug('Oauth session declare')
                : null
            )
          )
        }
        return of(null)
      })
    )
  }

  private getThirdPartySignInData(): Observable<ThirdPartyAuthData> {
    return this._platform.get().pipe(
      first(),
      switchMap((platform) => {
        if (platform.social) {
          return this._oauth.loadSocialSigninData().pipe(
            take(1),
            map((signinData) => {
              return {
                signinData,
                entityDisplayName: this.loadSocialSignInData(
                  signinData.entityID
                ),
              }
            })
          )
        } else if (
          platform.institutional ||
          platform.currentRoute === 'register'
        ) {
          return this._oauth.loadShibbolethSignInData().pipe(
            take(1),
            switchMap((signinData) =>
              this._disco
                .getInstitutionNameBaseOnId(signinData.providerId)
                .pipe(
                  map((entityDisplayName) => {
                    return {
                      entityDisplayName,
                      signinData,
                    }
                  })
                )
            )
          )
        } else {
          return of(null)
        }
      })
    )
  }

  private loadSocialSignInData(entityDisplayName: string) {
    if (entityDisplayName === 'facebook' || entityDisplayName === 'google') {
      entityDisplayName =
        entityDisplayName.charAt(0).toUpperCase() + entityDisplayName.slice(1)
    }
    return entityDisplayName
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
          retryWhen((errors) => {
            return errors.pipe(delay(2000)).pipe(
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
          })
        )
        // This is necessary since the backend responds with a CORS error when a
        // user is not logged in and userInfo.json is called

        // TODO @angel we need to avoid sending HTTP errors back from the backend on this scenario
        // so we can better interpret real errors here
        .pipe(catchError((error) => of(null)))
    )
  }

  // TODO @angel review
  // since the switch account is returning a 302 witch triggers a redirect to `my-orcid`
  // and we also trigger a reload, to reload the oauth page
  // there might be some scenarios where these two different request might not work as expected.
  switchAccount(delegator: Delegator) {
    const params = new HttpParams().append(
      'username',
      delegator.giverOrcid.path
    )
    return this._http
      .post(`${environment.API_WEB}switch-user`, '', {
        headers: this.headers,
        params: params,
      })
      .pipe(
        catchError((error) => {
          // TODO @angel @camelia review
          // The server response with a redirect to an http not secure page,
          // which equals a error status 0 to browsers
          if (error.status === 0) {
            this.refreshUserSession(true)
            return of(error)
          } else {
            return this._errorHandler.handleError(
              error,
              ERROR_REPORT.STANDARD_VERBOSE
            )
          }
        })
      )
  }

  setTimerAsHiddenState(hiddenTab: boolean) {
    // only reset the timer when the visibility is changed
    if (hiddenTab && !this.hiddenTab) {
      this.hiddenTab = hiddenTab
      this.reset$.next()
      this.interval$.next(
        this.START_IN_TWENTY_FIVE_MINUTES_AND_CHECK_EVERY_TWENTY_FIVE_MINUTES
      )
    } else if (!hiddenTab && this.hiddenTab) {
      this.hiddenTab = hiddenTab
      this.reset$.next()
      this.interval$.next(
        this.START_IMMEDIATELY_AND_CHECK_EVERY_TWENTY_FIVE_MINUTES
      )
    }
  }

  noRedirectLogout () {
    return this._http.get(`${environment.API_WEB}signout`, {
      headers: this.headers,
      observe: 'response',
      responseType: 'text',
    }).pipe(tap(()=> {},() => {
      this.window.location.reload()
    }))
    
  }
}
