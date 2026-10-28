import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { RecoveryPhoneChallengeService } from '../../../core/two-factor-authentication/recovery-phone-challenge.service'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { WINDOW } from 'src/app/cdk/window'
import { Status } from '../../../types/two-factor.endpoint'

@Component({
  selector: 'app-settings-security',
  templateUrl: './settings-security.component.html',
  styleUrls: ['./settings-security.component.scss'],
  standalone: false,
})
export class SettingsSecurityComponent implements OnInit, OnDestroy {
  titleAccountPassword = $localize`:@@account.accountPassword:Account password`
  titleTwoFactor = $localize`:@@account.twoPassword:Two-factor authentication (2FA)`
  titleAlternativeSignin = $localize`:@@account.alternativeSignin:Alternate sign in accounts`

  settingSecurityPasswordOpen = false
  settingSecurityTwoFactor = false
  settingSecurityAlternateAccounts = false

  settingSecurityPasswordLoading = false
  settingSecurityTwoFactorLoading = false
  settingSecurityAlternateAccountsLoading = false

  twoFactorEnabled = false
  twoFactorInfo: Status | undefined

  private readonly $destroy = new Subject<void>()

  constructor(
    private twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private _recoveryPhoneChallenge: RecoveryPhoneChallengeService,
    @Inject(WINDOW) private _window: Window
  ) {}

  ngOnInit(): void {
    this.loadTwoFactorState()
    this._recoveryPhoneChallenge.twoFactorDisabled$
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.twoFactorEnabled = false
        this.loadTwoFactorState()
      })
    const hash = this._window.location.hash.substr(1)
    switch (hash) {
      case 'password':
        this.settingSecurityPasswordOpen = true
        break
      case '2FA':
        this.settingSecurityTwoFactor = true
        break
      case 'alternate-signin':
        this.settingSecurityAlternateAccounts = true
        break
    }
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }

  twoFactorStateChanges($event) {
    this.twoFactorEnabled = $event
  }

  private loadTwoFactorState(): void {
    this.twoFactorAuthenticationService
      .checkState()
      .pipe(first())
      .subscribe((result) => {
        this.twoFactorInfo = result
        this.twoFactorEnabled = result.enabled
      })
  }
}
