import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { UserInfo, NameForm } from 'src/app/types'
import { timer, Observable, of, Subject, forkJoin } from 'rxjs'
import {
  switchMap,
  tap,
  delay,
  catchError,
  filter,
  switchMapTo,
  map,
  startWith,
  retryWhen,
  shareReplay,
  retry,
} from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { UserStatus } from '../../types/userStatus.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}
  private currentlyLoggedIn = true
  private loggingStateComesFromTheServer = false
  private $infoOnEachStatusUpdateObservable: Observable<{
    userInfo: UserInfo
    nameForm: NameForm
    displayName: string
    orcidUrl: string
  }>

  private getUserInfo(): Observable<UserInfo> {
    return of({
      EFFECTIVE_USER_ORCID: '0000-0002-2036-7905',
      PRIMARY_EMAIL: 'leomendoza123@gmail.com',
      DEVELOPER_TOOLS_ENABLED: 'false',
      IS_PRIMARY_EMAIL_VERIFIED: 'false',
      LOCKED: 'false',
      CLAIMED: 'true',
      HAS_VERIFIED_EMAIL: 'false',
      REAL_USER_ORCID: '0000-0002-9361-1905',
      IN_DELEGATION_MODE: 'true',
      DELEGATED_BY_ADMIN: 'true',
      LAST_MODIFIED: '2020-05-05 22:12:42.566663',
    })
  }

  public getUserStatus() {
    return of(true)
  }

  private getNameForm(): Observable<NameForm> {
    return of({
      visibility: {
        errors: [],
        required: true,
        getRequiredMessage: null,
        visibility: 'PUBLIC',
      },
      errors: [],
      givenNames: {
        errors: [],
        value: 'Leonardo',
        required: true,
        getRequiredMessage: null,
      },
      familyName: {
        errors: [],
        value: 'Mendoza',
        required: true,
        getRequiredMessage: null,
      },
    })
  }

  getUserInfoOnEachStatusUpdate(): Observable<{
    userInfo: UserInfo
    nameForm: NameForm
    displayName: string
    orcidUrl: string
  }> {
    // If an observable already exists, the same is shared between subscriptions
    // If not creates an observable
    if (this.$infoOnEachStatusUpdateObservable) {
      return this.$infoOnEachStatusUpdateObservable
    } else {
      return (this.$infoOnEachStatusUpdateObservable =
        // Every 30 seconds...
        timer(0, 30 * 1000)
          // Check for updates on userStatus.json
          .pipe(switchMapTo(this.getUserStatus()))
          // Check if loggedIn state  has changed since the last time
          //
          // Also turns on the flag loggingStateComesFromTheServer
          // indicating that the current logging state is taken from the server,
          // and not the initial assumption. (more on this on the following pipe)
          .pipe(
            filter((loggedIn) => {
              if (loggedIn) {
                this.loggingStateComesFromTheServer = true
                if (!(loggedIn === this.currentlyLoggedIn)) {
                  this.currentlyLoggedIn = loggedIn
                  return true
                }
              }
              return false
            })
          )
          // At the very beginning assumes the user is logged in,
          // this is to avoid waiting for userStatus.json before calling userInfo.json and nameForm.json on the first load
          .pipe(startWith(true))
          // If the user is logged in get the UserStatus.json and nameForm.json
          // If not return a null value
          .pipe(
            switchMap((loggedIn) => {
              if (!loggedIn) {
                return of(null)
              }
              if (loggedIn) {
                // return an object with the most recent response of both endpoints
                return forkJoin({
                  userInfo: this.getUserInfo().pipe(this.handleErrors),
                  nameForm: this.getNameForm().pipe(this.handleErrors),
                })
              }
            }),
            map((data: { userInfo: UserInfo; nameForm: NameForm }) => {
              // computes the name that should be displayed on the UI
              return {
                ...data,
                ...{
                  displayName: this.getDisplayName(data.nameForm),
                  orcidUrl:
                    'https:' + environment.BASE_URL + data && data.userInfo
                      ? data.userInfo.REAL_USER_ORCID
                      : '',
                },
              }
            })
          )
          .pipe(shareReplay(1)))
    }
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
