import { Injectable } from '@angular/core'
import { userInfo } from 'os'
import { map } from 'rxjs/operators'
import { UserService } from 'src/app/core'
type Interstitials = 'DOMAIN_INTERSTITIAL'

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
        if (interstitial === 'DOMAIN_INTERSTITIAL') {
          // This is a weird condition as we changed the localstorage value from OAUTH_DOMAIN_INTERSTITIAL to DOMAIN_INTERSTITIAL
          // This is a fix so DOMAIN_INTERSTITIAL is backwards compatible with OAUTH_DOMAIN_INTERSTITIAL
          return (
            localStorage.getItem(effectiveUser + '_DOMAIN_INTERSTITIAL') ===
              'true' ||
            localStorage.getItem(
              effectiveUser + '_OAUTH_DOMAIN_INTERSTITIAL'
            ) === 'true'
          )
        } else {
          return (
            localStorage.getItem(effectiveUser + '_' + interstitial) === 'true'
          )
        }
      })
    )
  }
}
