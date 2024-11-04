import { Injectable } from '@angular/core'
import { userInfo } from 'os'
import { map } from 'rxjs/operators'
import { UserService } from 'src/app/core'
type Interstitials = 'OAUTH_DOMAIN_INTERSTITIAL' | 'SIGN_IN_DOMAIN_INTERSTITIAL'

@Injectable({
  providedIn: 'root',
})
export class InterstitialsService {
  constructor(private _userInfo: UserService) {}

  setInterstitialsViewed(interstitial: Interstitials) {
    return this._userInfo.getUserSession().pipe(
      map((userInfo) => {
        const effectiveUser = userInfo.userInfo.EFFECTIVE_USER_ORCID
        localStorage.setItem(effectiveUser + '_' + interstitial, 'true')
      })
    )
  }
  getInterstitialsViewed(interstitial: Interstitials) {
    return this._userInfo.getUserSession().pipe(
      map((userInfo) => {
        const effectiveUser = userInfo.userInfo.EFFECTIVE_USER_ORCID
        return (
          localStorage.getItem(effectiveUser + '_' + interstitial) === 'true'
        )
      })
    )
  }
}
