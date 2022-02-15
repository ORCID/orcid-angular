import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DateAdapter } from '@angular/material/core'
import { MatDialog } from '@angular/material/dialog'
import { EMPTY, of, throwError } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { AccountActionsDuplicatedService } from 'src/app/core/account-actions-duplicated/account-actions-duplicated.service'
import { OauthService } from 'src/app/core/oauth/oauth.service'

import { DialogActionsDuplicatedMergedConfirmedComponent } from '../dialog-actions-duplicated-merged-confirmed/dialog-actions-duplicated-merged-confirmed.component'
import { DialogActionsDuplicatedTwoFactorAuthComponent } from '../dialog-actions-duplicated-two-factor-auth/dialog-actions-duplicated-two-factor-auth.component'
import { DialogActionsDuplicatedComponent } from '../dialog-actions-duplicated/dialog-actions-duplicated.component'

@Component({
  selector: 'app-settings-actions-duplicated',
  templateUrl: './settings-actions-duplicated.component.html',
  styleUrls: ['./settings-actions-duplicated.component.scss'],
})
export class SettingsActionsDuplicatedComponent implements OnInit {
  constructor(
    private _duplicateService: AccountActionsDuplicatedService,
    private _form: FormBuilder,
    private _dialog: MatDialog
  ) {}
  @Output() loading = new EventEmitter<boolean>()

  form: FormGroup
  errors: any[]
  showBadRecoveryCode = false
  showBadVerificationCode = false
  show2FA = true

  ngOnInit(): void {
    this.form = this._form.group({
      deprecatingOrcidOrEmail: ['', Validators.required],
      deprecatingPassword: ['', Validators.required],
    })
  }

  deprecatedAccount() {
    this.errors = []
    this.loading.next(true)
    this._duplicateService
      .deprecate(this.form.value)
      .pipe(
        switchMap((data) => {
          this.loading.next(false)
          if (data.errors?.length) {
            this.errors = data.errors
            return throwError('error-backend-errors')
          }
          if (data.verificationCodeRequired) {
            return this._dialog
              .open(DialogActionsDuplicatedTwoFactorAuthComponent, { data })
              .afterClosed()
          } else {
            return of(data)
          }
        }),
        switchMap((data) => {
          if (data) {
            return this._dialog
              .open(DialogActionsDuplicatedComponent, { data })
              .afterClosed()
          } else {
            return throwError('error-2FA-fail')
          }
        }),
        switchMap((data) => {
          if (data) {
            this.loading.next(true)
            return this._duplicateService.confirmDeprecate(data)
          } else {
            return throwError('error-user-cancelled')
          }
        }),
        switchMap((data) => {
          this.loading.next(false)
          return this._dialog
            .open(DialogActionsDuplicatedMergedConfirmedComponent, {
              data,
            })
            .afterClosed()
        })
      )
      .subscribe(() => {
        this.loading.next(false)
      })
  }
}
