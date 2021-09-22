import { Component, Input, OnInit } from '@angular/core'
import { first, takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { Subject } from 'rxjs'
import { UserRecord } from '../../../types/record.local'
import { ComponentType } from '@angular/cdk/portal'
import { MatDialog } from '@angular/material/dialog'
import { TopBarVerificationEmailModalComponent } from './modals/top-bar-verification-email-modal/top-bar-verification-email-modal.component'

@Component({
  selector: 'app-top-bar-verification-email',
  templateUrl: './top-bar-verification-email.component.html',
  styleUrls: [
    './top-bar-verification-email.component.scss',
    './top-bar-verification-email.component.scss-theme.scss',
  ]
})
export class TopBarVerificationEmailComponent implements OnInit {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @Input() userRecord: UserRecord

  isMobile: boolean

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }

  ngOnInit(): void {
  }

  resendVerificationEmail() {
      this._platform
        .get()
        .pipe(first())
        .subscribe((platform) => {
          const modalComponent = this._dialog.open(TopBarVerificationEmailModalComponent, {
            width: '850px',
            maxWidth: platform.tabletOrHandset ? '95vw' : '80vw',
          })
          modalComponent.componentInstance.primaryEmail = this.userRecord?.userInfo?.PRIMARY_EMAIL
        })
  }
}
