import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { first, switchMap, takeUntil, tap } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { AccountSecurityAlternateSignInService } from 'src/app/core/account-security-alternate-sign-in/account-security-alternate-sign-in.service'
import { SocialAccount } from 'src/app/types/account-alternate-sign-in.endpoint'
import { AuthChallengeComponent } from '@orcid/registry-ui'

import { AuthChallengeFormData } from '../../../types/common.endpoint'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'

@Component({
  selector: 'app-settings-security-alternate-sign-in',
  templateUrl: './settings-security-alternate-sign-in.component.html',
  styleUrls: ['./settings-security-alternate-sign-in.component.scss'],
  standalone: false,
})
export class SettingsSecurityAlternateSignInComponent
  implements OnInit, OnDestroy
{
  @Input() twoFactorState: boolean
  @Output() loading = new EventEmitter<boolean>()
  accounts$: Observable<SocialAccount[]>
  form: UntypedFormGroup
  success = false
  cancel = false
  deletedAccount = ''

  displayedColumns = ['provider', 'email', 'granted', 'actions']
  $destroy = new Subject<void>()
  isMobile: any
  refreshAccounts$ = new BehaviorSubject<void>(undefined)
  authChallengeLabel = $localize`:@@accountSettings.security.unlinkTheAlternateSignInAccount:unlink the alternate sign in account`

  constructor(
    private _accountSettingAlternate: AccountSecurityAlternateSignInService,
    private _fb: UntypedFormBuilder,
    private _matDialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      id: [null, Validators.required],
      password: [null, Validators.required],
      twoFactorCode: [null, [Validators.minLength(6), Validators.maxLength(6)]],
      twoFactorRecoveryCode: [
        null,
        [Validators.minLength(10), Validators.maxLength(10)],
      ],
    })
    this.accounts$ = this.refreshAccounts$.pipe(
      tap(() => this.loading.next(true)),
      switchMap(() => this._accountSettingAlternate.get()),
      tap(() => this.loading.next(false))
    )
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }

  openAuthChallenge(memberName: string) {
    const dialogRef = this._matDialog.open<AuthChallengeComponent>(
      AuthChallengeComponent,
      {
        data: {
          parentForm: this.form,
          actionDescription: this.authChallengeLabel,
          memberName: memberName,
          showTwoFactorField: this.twoFactorState,
        } as AuthChallengeFormData,
      }
    )

    dialogRef.componentInstance.submitAttempt
      .pipe(
        takeUntil(dialogRef.afterClosed()),
        switchMap(() =>
          this._accountSettingAlternate.delete(this.form.value).pipe(first())
        )
      )
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.refreshAccounts$.next()
            dialogRef.close(true)
          } else {
            dialogRef.componentInstance.loading = false
            dialogRef.componentInstance.processBackendResponse(response)
          }
        },
      })

    dialogRef.afterClosed().subscribe((success) => {
      this.deletedAccount = memberName
      this.form.reset()
      if (success) {
        this.success = true
      } else {
        this.cancel = true
      }
    })
  }

  delete(deleteAcc: SocialAccount) {
    this.success = false
    this.cancel = false
    this.form.patchValue({
      id: deleteAcc.id,
    })
    this.openAuthChallenge(deleteAcc.idpName)
  }
  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
