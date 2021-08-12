import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { UserInfo } from 'src/app/types'
import { UserRecordOptions } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  constructor(private _http: HttpClient) {}

  public getUserInfo(options?: UserRecordOptions): Observable<UserInfo> {
    return this._http
      .get<UserInfo>(
        environment.API_WEB +
          (options?.publicRecordId ? options.publicRecordId + '/' : '') +
          'userInfo.json',
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((value) => {
          value.RECORD_WITH_ISSUES = !!(
            value.IS_LOCKED === 'true' ||
            value.IS_DEACTIVATED === 'true' ||
            value.PRIMARY_RECORD
          )
          return value
        })
      )
  }
}
