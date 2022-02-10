import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { AccountActionsDeactivateService } from 'src/app/core/account-actions-deactivate/account-actions-deactivate.service'

@Component({
  selector: 'app-settings-actions-deactivate',
  templateUrl: './settings-actions-deactivate.component.html',
  styleUrls: [
    './settings-actions-deactivate.component.scss',
    './settings-actions-deactivate.component.scss-theme.scss',
  ],
})
export class SettingsActionsDeactivateComponent implements OnInit, OnDestroy {
  @Output() loading = new EventEmitter<boolean>()
  isMobile: any
  $destroy = new Subject<void>()
  deactivatedEmail

  constructor(
    private _platform: PlatformInfoService,
    private _deactivate: AccountActionsDeactivateService
  ) {}

  ngOnInit(): void {
    this.deactivatedEmail = ''
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }
  deactivateOrcidAccount() {
    this.loading.next(true)
    this._deactivate.deactivateAccount().subscribe((email) => {
      this.deactivatedEmail = email
      this.loading.next(false)
    })
  }
  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
