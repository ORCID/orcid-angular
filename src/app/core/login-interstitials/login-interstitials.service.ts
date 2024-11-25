import { Injectable } from '@angular/core'
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogState,
} from '@angular/material/legacy-dialog'
import { ShareEmailsDomainsComponent } from 'src/app/cdk/interstitials/share-emails-domains/share-emails-domains.component'
import { EmailsEndpoint } from 'src/app/types'
import { UserRecord } from 'src/app/types/record.local'
import { ShareEmailsDomainsComponentDialogInput } from 'src/app/cdk/interstitials/share-emails-domains/share-emails-domains.component'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { Observable } from 'rxjs'
import { ShareEmailsDomainsDialogComponent } from 'src/app/cdk/interstitials/share-emails-domains/share-emails-domains-dialog.component'
import { TogglzService } from '../togglz/togglz.service'

@Injectable({
  providedIn: 'root',
})
export class LoginInterstitialsService {
  alreadySawSignDomainInterstitial: boolean
  loginDomainsInterstitialEnabled: boolean
  constructor(
    private _matDialog: MatDialog,
    private interstitialService: InterstitialsService,
    private toggleService: TogglzService
  ) {
    this.interstitialService
      .getInterstitialsViewed('SIGN_IN_DOMAIN_INTERSTITIAL')
      .subscribe((viewed) => {
        this.alreadySawSignDomainInterstitial = viewed
      })
    this.toggleService
      .getStateOf('LOGIN_DOMAINS_INTERSTITIAL')
      .subscribe((state) => {
        this.loginDomainsInterstitialEnabled = state
      })
  }

  checkLoginInterstitials(userRecord: UserRecord): Observable<string[]> | void {
    let isNotImpersonating
    if (userRecord.userInfo) {
      isNotImpersonating =
        userRecord.userInfo.REAL_USER_ORCID ===
        userRecord.userInfo.EFFECTIVE_USER_ORCID
    }
    if (
      isNotImpersonating &&
      userRecord.emails &&
      userRecord.emails.emailDomains &&
      !this.userHasPublicDomains(userRecord.emails) &&
      this.userHasPrivateDomains(userRecord.emails) &&
      this.loginDomainsInterstitialEnabled &&
      !this.alreadySawSignDomainInterstitial
    ) {
      this.alreadySawSignDomainInterstitial = true
      this.interstitialService
        .setInterstitialsViewed('SIGN_IN_DOMAIN_INTERSTITIAL')
        .subscribe()
      const data: ShareEmailsDomainsComponentDialogInput = {
        userEmailsJson: userRecord.emails,
      }

      const dialog = this._matDialog.open(ShareEmailsDomainsDialogComponent, {
        data,
        width: '580px',
        disableClose: true,
        autoFocus: false,
        restoreFocus: false,
      })
      return dialog.afterClosed()
    }
  }

  userHasPublicDomains(value: EmailsEndpoint): any {
    return !!value.emailDomains.find((domain) => domain.visibility === 'PUBLIC')
  }

  userHasPrivateDomains(value: EmailsEndpoint): boolean {
    return !!value.emailDomains.find((domain) => domain.visibility !== 'PUBLIC')
  }
}
