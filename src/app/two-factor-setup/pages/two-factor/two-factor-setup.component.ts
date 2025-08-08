import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { WINDOW } from '../../../cdk/window'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { first, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { ApplicationRoutes } from '../../../constants'
import { Router } from '@angular/router'

@Component({
    selector: 'app-two-factor-setup-module',
    templateUrl: './two-factor-setup.component.html',
    styleUrls: [
        './two-factor-setup.component.scss',
        './two-factor-setup.component.scss-theme.scss',
    ],
    preserveWhitespaces: true,
    standalone: false
})
export class TwoFactorSetupComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  platform: PlatformInfo
  qrCodeUrl: string
  applicationRoutes = ApplicationRoutes
  showBackupCodes = false
  backupCodes: string
  backupCodesClipboard: string

  constructor(
    @Inject(WINDOW) private window: Window,
    private router: Router,
    private _twoFactorService: TwoFactorAuthenticationService,
    private _platformInfo: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this._twoFactorService
      .checkState()
      .pipe(first())
      .subscribe((result) => {
        if (result.enabled) {
          this.router.navigate(['/' + this.applicationRoutes.account])
        }
      })

    this._platformInfo
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
      })
  }

  twoFactorEnabled($event: {
    backupCodes?: string
    backupCodesClipboard?: string
  }) {
    this.showBackupCodes = true
    this.backupCodes = $event.backupCodes
    this.backupCodesClipboard = $event.backupCodesClipboard
  }

  ngOnDestroy(): void {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
