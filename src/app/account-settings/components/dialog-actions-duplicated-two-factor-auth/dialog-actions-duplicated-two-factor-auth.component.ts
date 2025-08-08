import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { OauthService } from 'src/app/core/oauth/oauth.service'
import { DuplicateRemoveEndpoint } from 'src/app/types/account-actions-duplicated'

import { DialogActionsDuplicatedMergedConfirmedComponent } from '../dialog-actions-duplicated-merged-confirmed/dialog-actions-duplicated-merged-confirmed.component'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'

@Component({
    selector: 'app-dialog-actions-duplicated-two-factor-auth',
    templateUrl: './dialog-actions-duplicated-two-factor-auth.component.html',
    styleUrls: ['./dialog-actions-duplicated-two-factor-auth.component.scss'],
    standalone: false
})
export class DialogActionsDuplicatedTwoFactorAuthComponent implements OnInit {
  showBadVerificationCode: boolean
  showBadRecoveryCode: boolean
  loading: boolean
  constructor(
    private _twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private matRef: MatDialogRef<DialogActionsDuplicatedMergedConfirmedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DuplicateRemoveEndpoint
  ) {}

  ngOnInit(): void {}
  authenticate(code: { verificationCode?: string; recoveryCode?: string }) {
    this.showBadVerificationCode = false
    this.showBadRecoveryCode = false
    this.loading = true
    this._twoFactorAuthenticationService
      .submitCodeForAnotherAccount({
        orcid: this.data.deprecatingOrcid,
        verificationCode: code.verificationCode || null,
        recoveryCode: code.recoveryCode || null,
        errors: [],
        redirectUrl: null,
      })
      .subscribe((res) => {
        this.loading = false
        if (res.errors && res.errors.length > 0) {
          if (res.errors[0].includes('verification')) {
            this.showBadVerificationCode = true
          } else {
            this.showBadRecoveryCode = true
          }
        } else if (res.redirectUrl) {
          this.matRef.close(this.data)
        }
      })
  }
}
