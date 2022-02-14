import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { AccountSecurityAlternateSignInService } from 'src/app/core/account-security-alternate-sign-in/account-security-alternate-sign-in.service'
import { SocialAccount } from 'src/app/types/account-alternate-sign-in.endpoint'

import { DialogSecurityAlternateAccountDeleteComponent } from '../dialog-security-alternate-account-delete/dialog-security-alternate-account-delete.component'

@Component({
  selector: 'app-settings-security-alternate-sign-in',
  templateUrl: './settings-security-alternate-sign-in.component.html',
  styleUrls: ['./settings-security-alternate-sign-in.component.scss'],
})
export class SettingsSecurityAlternateSignInComponent implements OnInit {
  @Output() loading = new EventEmitter<boolean>()
  accounts$: Observable<SocialAccount[]>

  displayedColumns = ['provider', 'email', 'granted', 'actions']

  constructor(
    private _accountSettingAlternate: AccountSecurityAlternateSignInService,
    private _matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.accounts$ = this._accountSettingAlternate.get()
  }
  delete(deleteAcc: SocialAccount) {
    this._matDialog
      .open(DialogSecurityAlternateAccountDeleteComponent, { data: deleteAcc })
      .afterClosed()
      .subscribe((value) => {
        if (value) {
          this._accountSettingAlternate.delete(deleteAcc.id).subscribe(() => {
            this.accounts$ = this._accountSettingAlternate.get()
          })
        }
      })
  }
}
