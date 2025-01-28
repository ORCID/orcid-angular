import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { isEmpty } from 'lodash'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { UserInfo } from 'src/app/types'
import { UserRecordOptions } from 'src/app/types/record.local'

import { Router } from '@angular/router'
import { PlatformInfo, PlatformInfoService } from '../../cdk/platform-info'

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  platform: PlatformInfo

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _platform: PlatformInfoService
  ) {
    this._platform.get().subscribe((value) => (this.platform = value))
  }

  public getUserInfo(options?: UserRecordOptions): Observable<UserInfo> {
    return this._http
      .get<UserInfo>(
        runtimeEnvironment.API_WEB +
          (options?.publicRecordId ? options.publicRecordId + '/' : '') +
          'userInfo.json',
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((value) => {
          value.USER_NOT_FOUND = isEmpty(value)
          value.RECORD_WITH_ISSUES = !!(
            value.IS_LOCKED === 'true' ||
            value.IS_DEACTIVATED === 'true' ||
            value.PRIMARY_RECORD
          )

          if (
            this.platform.queryParameters.hasOwnProperty('orcid') &&
            !this.platform.hasOauthParameters
          ) {
            this._router.navigate(['/my-orcid'], {
              queryParams: { orcid: value.EFFECTIVE_USER_ORCID },
            })
          }

          return value
        })
      )
  }
}
