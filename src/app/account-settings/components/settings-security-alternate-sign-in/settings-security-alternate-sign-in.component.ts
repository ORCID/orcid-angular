import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable, Subject } from 'rxjs'
import { takeUntil, tap } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { AccountSecurityAlternateSignInService } from 'src/app/core/account-security-alternate-sign-in/account-security-alternate-sign-in.service'
import { SocialAccount } from 'src/app/types/account-alternate-sign-in.endpoint'

import { DialogSecurityAlternateAccountDeleteComponent } from '../dialog-security-alternate-account-delete/dialog-security-alternate-account-delete.component'

@Component({
  selector: 'app-settings-security-alternate-sign-in',
  templateUrl: './settings-security-alternate-sign-in.component.html',
  styleUrls: ['./settings-security-alternate-sign-in.component.scss'],
})
export class SettingsSecurityAlternateSignInComponent
  implements OnInit, OnDestroy
{
  @Output() loading = new EventEmitter<boolean>()
  accounts$: Observable<SocialAccount[]>

  displayedColumns = ['provider', 'email', 'granted', 'actions']
  $destroy = new Subject()
  isMobile: any

  constructor(
    private _accountSettingAlternate: AccountSecurityAlternateSignInService,
    private _matDialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this.loading.next(true)
    this.accounts$ = this._accountSettingAlternate.get().pipe(
      tap(() => {
        this.loading.next(false)
      })
    )
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }
  delete(deleteAcc: SocialAccount) {
    this.loading.next(true)
    this._matDialog
      .open(DialogSecurityAlternateAccountDeleteComponent, { data: deleteAcc })
      .afterClosed()
      .subscribe((value) => {
        this.loading.next(false)

        if (value) {
          this._accountSettingAlternate.delete(deleteAcc.id).subscribe(() => {
            this.accounts$ = this._accountSettingAlternate.get()
          })
        }
      })
  }
  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
