import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { catchError, filter, switchMap, tap } from 'rxjs/operators'
import { WINDOW } from '../../cdk/window'
import { UserStatus } from '../../types/userStatus.endpoint'
import {
  isAuthServerUrl,
  isOrcidWebUrl,
  toAbsoluteUrl,
} from '../xsrf/xsrf-urls'

@Injectable()
export class SessionExpiredInterceptor implements HttpInterceptor {
  private signedIn = false
  private redirecting = false

  constructor(@Inject(WINDOW) private window: Window) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const statusUrl = runtimeEnvironment.API_WEB + 'userStatus.json'
    const requestUrl = toAbsoluteUrl(req.url)
    const isStatus = [
      statusUrl,
      runtimeEnvironment.AUTH_SERVER + 'userStatus.json',
    ].some((url) => {
      const base = toAbsoluteUrl(url)
      return (
        requestUrl?.origin === base?.origin &&
        requestUrl?.pathname === base?.pathname
      )
    })
    if (isStatus) {
      const isLogout =
        toAbsoluteUrl(req.urlWithParams)?.searchParams.get('logUserOut') ===
        'true'
      return next.handle(req).pipe(
        tap((event) => {
          if (isLogout && event instanceof HttpResponse) {
            this.signedIn = false
            return
          }
          const status =
            event instanceof HttpResponse ? (event.body as UserStatus) : null
          if (typeof status?.loggedIn === 'boolean') {
            if (this.signedIn && !status.loggedIn && !this.redirecting) {
              this.redirecting = true
              this.window.location.assign('/signin')
            }
            this.signedIn = status.loggedIn
          }
        })
      )
    }
    if (!isOrcidWebUrl(req.url) || isAuthServerUrl(req.url))
      return next.handle(req)

    return next.handle(req).pipe(
      catchError((error) => {
        if (!this.signedIn || this.redirecting) return throwError(() => error)
        const check = new HttpRequest('GET', statusUrl, {
          withCredentials: true,
        })
        return next.handle(check).pipe(
          catchError(() => of(null)),
          filter((event) => event === null || event instanceof HttpResponse),
          switchMap((event) => {
            if (
              !this.redirecting &&
              event instanceof HttpResponse &&
              (event.body as UserStatus)?.loggedIn === false
            ) {
              this.signedIn = false
              this.redirecting = true
              this.window.location.assign('/signin')
            }
            return throwError(() => error)
          })
        )
      })
    )
  }
}
