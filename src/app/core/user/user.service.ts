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
} from 'rxjs/operators'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}
  private currentlyLoggedIn = true
  private loggingStateComesFromTheServer = false
  private $infoOnEachStatusUpdateObservable: Observable<{
    userInfo: UserInfo
    nameForm: NameForm
    displayName: string
  }>

  private getUserInfo(): Observable<UserInfo> {
    return this._http.get<UserInfo>(environment.API_WEB + 'userInfo.json', {
      withCredentials: true,
    })
  }

  public getUserStatus() {
    return this._http
      .get<any>(environment.API_WEB + 'userStatus.json', {
        withCredentials: true,
      })
      .pipe(catchError(val => of({})))
      .pipe(map(response => response.loggedIn || null))
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
            filter(loggedIn => {
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
            switchMap(loggedIn => {
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
                ...{ displayName: this.getDisplayName(data.nameForm) },
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
          retryWhen(errors =>
            errors.pipe(delay(2000)).pipe(
              tap(x => {
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
        .pipe(catchError(error => of(null)))
    )
  }
}
