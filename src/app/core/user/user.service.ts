import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { UserInfo } from 'src/app/types'
import { timer, Observable } from 'rxjs'
import { switchMap, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}

  getUserInfo(): Observable<UserInfo> {
    return timer(0, 500).pipe(
      // every 5 seconds calls user Info
      switchMap(() =>
        this._http.get<UserInfo>(
          'https://localhost:8443/orcid-web/userInfo.json'
        )
      )
    )
  }
}
