import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { of, throwError } from 'rxjs'
import { switchMap, take } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { AccountActionsDuplicatedService } from 'src/app/core/account-actions-duplicated/account-actions-duplicated.service'
import { UserSession } from 'src/app/types/session.local'

import { DialogActionsDuplicatedMergedConfirmedComponent } from '../dialog-actions-duplicated-merged-confirmed/dialog-actions-duplicated-merged-confirmed.component'
import { DialogActionsDuplicatedTwoFactorAuthComponent } from '../dialog-actions-duplicated-two-factor-auth/dialog-actions-duplicated-two-factor-auth.component'
import { DialogActionsDuplicatedComponent } from '../dialog-actions-duplicated/dialog-actions-duplicated.component'

@Component({
  selector: 'app-settings-actions-duplicated',
  templateUrl: './settings-actions-duplicated.component.html',
  styleUrls: ['./settings-actions-duplicated.component.scss'],
  preserveWhitespaces: true,
})
export class SettingsActionsDuplicatedComponent implements OnInit {
  userSession: UserSession
  constructor(
    private _duplicateService: AccountActionsDuplicatedService,
    private _form: UntypedFormBuilder,
    private _dialog: MatDialog,
    private _user: UserService
  ) {}
  @Output() loading = new EventEmitter<boolean>()
  @Output() close = new EventEmitter()

  form: UntypedFormGroup
  errors: any[]
  showBadRecoveryCode = false
  showBadVerificationCode = false
  show2FA = true

  ngOnInit(): void {
    this.form = this._form.group({
      deprecatingOrcidOrEmail: ['', Validators.required],
      deprecatingPassword: ['', Validators.required],
    })
    this._user
      .getUserSession()
      .pipe(take(1))
      .subscribe((userSession) => {
        this.userSession = userSession
      })
  }

  onSubmit() {
    this.loading.next(true)
    this._duplicateService
      .deprecate(this.form.value)
      .pipe(
        switchMap((data) => {
          this.errors = []
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
      .subscribe(
        (value) => {
          this.loading.next(false)
          this.close.next()
        },
        (error) => {
          this.loading.next(false)
        }
      )
  }
}
