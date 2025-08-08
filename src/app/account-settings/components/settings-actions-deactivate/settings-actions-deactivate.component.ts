import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { AccountActionsDeactivateService } from 'src/app/core/account-actions-deactivate/account-actions-deactivate.service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'

@Component({
    selector: 'app-settings-actions-deactivate',
    templateUrl: './settings-actions-deactivate.component.html',
    styleUrls: [
        './settings-actions-deactivate.component.scss',
        './settings-actions-deactivate.component.scss-theme.scss',
    ],
    preserveWhitespaces: true,
    standalone: false
})
export class SettingsActionsDeactivateComponent implements OnInit, OnDestroy {
  @Output() loading = new EventEmitter<boolean>()
  isMobile: any
  $destroy = new Subject<void>()
  deactivatedEmail
  removeDuplicateUrl: string
  alreadySendedDeactivatedAccountRequest: boolean
  constructor(
    private _platform: PlatformInfoService,
    private _deactivate: AccountActionsDeactivateService,
    private _togglz: TogglzService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.deactivatedEmail = ''
    this.removeDuplicateUrl = '/account'
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }
  deactivateOrcidAccount() {
    this.alreadySendedDeactivatedAccountRequest = true
    this.loading.next(true)
    this._deactivate.deactivateAccount().subscribe((response) => {
      this.deactivatedEmail = response.email
      this.loading.next(false)
    })
  }
  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
