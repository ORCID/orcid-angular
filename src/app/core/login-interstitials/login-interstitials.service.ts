import { Injectable } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { EmailsEndpoint } from 'src/app/types'
import { UserRecord } from 'src/app/types/record.local'
import { ShareEmailsDomainsComponentDialogInput } from 'src/app/cdk/interstitials/share-emails-domains/share-emails-domains.component'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { EMPTY, Observable } from 'rxjs'
import { ShareEmailsDomainsDialogComponent } from 'src/app/cdk/interstitials/share-emails-domains/share-emails-domains-dialog.component'
import { TogglzService } from '../togglz/togglz.service'
import { filter, switchMap, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class LoginInterstitialsService {
  alreadySawSignDomainInterstitial: boolean
  loginDomainsInterstitialEnabled: boolean
  alreadyCheckLoginInterstitials: boolean
  constructor(
    private _matDialog: MatDialog,
    private interstitialService: InterstitialsService,
    private toggleService: TogglzService
  ) {
    this.toggleService
      .getStateOf('LOGIN_DOMAINS_INTERSTITIAL')
      .subscribe((state) => {
        this.loginDomainsInterstitialEnabled = state
      })
  }

  checkLoginInterstitials(userRecord: UserRecord): Observable<string[]> {
    if (!userRecord?.userInfo) {
      return EMPTY
    }

    const isNotImpersonating =
      userRecord.userInfo.REAL_USER_ORCID ===
      userRecord.userInfo.EFFECTIVE_USER_ORCID
    if (isNotImpersonating && !this.alreadyCheckLoginInterstitials) {
      this.alreadyCheckLoginInterstitials = true
      if (
        !this.userHasPublicDomains(userRecord.emails) &&
        this.userHasPrivateDomains(userRecord.emails) &&
        userRecord?.emails?.emailDomains
      ) {
        return this.interstitialService
          .getInterstitialsViewed('DOMAIN_INTERSTITIAL')
          .pipe(
            tap((viewed) => {
              this.alreadySawSignDomainInterstitial = viewed
            }),
            filter(() => {
              return (
                this.loginDomainsInterstitialEnabled &&
                !this.alreadySawSignDomainInterstitial
              )
            }),
            switchMap(() => {
              this.alreadySawSignDomainInterstitial = true
              return this.interstitialService.setInterstitialsViewed(
                'DOMAIN_INTERSTITIAL'
              )
            }),
            switchMap(() => {
              const data: ShareEmailsDomainsComponentDialogInput = {
                userEmailsJson: userRecord.emails,
              }

              const dialog = this._matDialog.open(
                ShareEmailsDomainsDialogComponent,
                {
                  data,
                  width: '580px',
                  disableClose: true,
                  autoFocus: false,
                  restoreFocus: false,
                  maxHeight: 'calc(100vh - 20px)',
                }
              )
              return dialog.afterClosed()
            })
          )
      }
    } else {
      return EMPTY
    }
  }

  userHasPublicDomains(value: EmailsEndpoint): any {
    return !!value.emailDomains.find((domain) => domain.visibility === 'PUBLIC')
  }

  userHasPrivateDomains(value: EmailsEndpoint): boolean {
    return !!value.emailDomains.find((domain) => domain.visibility !== 'PUBLIC')
  }
}
