import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { throwError } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { take } from 'rxjs/internal/operators/take'

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  browserSupport = 'unchecked'
  constructor(
    private _platform: PlatformInfoService,
    private _cookie: CookieService
  ) {
    this.checkBrowser()
  }
  public handleError(error: Error | HttpErrorResponse) {
    const platformDetails = this.browserSupport + this.checkCSRF()
    if (error instanceof HttpErrorResponse) {
      // Server error
      console.error(
        `
__Server error__
(status:${error.status} (${error.statusText}) url: ${error.url})
name: "${error.name}"
message: "${error.message}"
ok: "${error.ok}"
platform"${platformDetails}
`
      )
      return throwError({
        error: error,
        message: `${error.status} (${error.statusText}) ${platformDetails}`,
      })
    } else {
      // Client side error
      console.error(
        `
__Local error__
(name:${error.name})
message: "${error.message}"
stack: "${error.stack}"
platform"${platformDetails}
`
      )
      return throwError({
        error: error,
        message: error.name + platformDetails,
      })
    }
  }

  public xml2jsParser(error) {
    console.error(error)
  }

  private checkBrowser() {
    this._platform
      .get()
      .pipe(take(1))
      .subscribe((val) => {
        this.browserSupport = val.unsupportedBrowser ? '/unsupported' : ''
      })
  }

  private checkCSRF() {
    if (!this._cookie.get('XSRF-TOKEN')) {
      return '/no-XSRF'
    } else {
      return ''
    }
  }
}
