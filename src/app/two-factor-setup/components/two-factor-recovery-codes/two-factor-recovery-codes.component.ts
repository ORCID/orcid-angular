import { Component, Inject, Input, OnInit } from '@angular/core'
import { ApplicationRoutes } from '../../../constants'
import { WINDOW } from '../../../cdk/window'
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
import { RumJourneyEventService } from '../../../rum/service/customEvent.service'
import { AppEventName } from '../../../rum/app-event-names'

@Component({
  selector: 'app-two-factor-recovery-codes',
  templateUrl: './two-factor-recovery-codes.component.html',
  styleUrls: [
    './two-factor-recovery-codes.component.scss',
    './two-factor-recovery-codes.component.scss-theme.scss',
  ],
  standalone: false,
})
export class TwoFactorRecoveryCodesComponent implements OnInit {
  @Input() backupCodes: string
  @Input() backupCodesClipboard: string
  applicationRoutes = ApplicationRoutes
  twoFactorForm: UntypedFormGroup
  hasDownloadedOrCopied = false

  tooltipClipboard = $localize`:@@account.clipboard:Backup codes have been copied to the clipboard`

  constructor(
    @Inject(WINDOW) private window: Window,
    private router: Router,
    private _observability: RumJourneyEventService
  ) {}

  ngOnInit(): void {
    this._observability.recordSimpleEvent(
      AppEventName.TwoFactorSetupStep2Loaded
    )

    this.twoFactorForm = new UntypedFormGroup({
      backupCodes: new UntypedFormControl(this.backupCodes, []),
      confirmCodes: new UntypedFormControl(false, [Validators.requiredTrue]),
    })
  }

  downloadRecoveryCodes() {
    const blob = new Blob([this.backupCodes], { type: 'text/plain' })
    const link = this.window.document.createElement('a')
    link.href = this.window.window.URL.createObjectURL(blob)
    link.download = 'recovery-codes'
    this.window.document.body.appendChild(link)
    link.click()
    this.window.document.body.removeChild(link)
    this.hasDownloadedOrCopied = true
  }

  markCodesCopied() {
    this.hasDownloadedOrCopied = true
  }

  get canCompleteSetup() {
    return (
      this.hasDownloadedOrCopied &&
      this.twoFactorForm.get('confirmCodes')?.value
    )
  }

  completeSetup() {
    if (!this.canCompleteSetup) {
      this.twoFactorForm.markAllAsTouched()
      return
    }

    this._observability.recordSimpleEvent(
      AppEventName.TwoFactorSetupFinalButtonClicked
    )
    this.router.navigate(['/' + this.applicationRoutes.account]).then((ok) => {
      if (ok) {
        this._observability.recordSimpleEvent(
          AppEventName.TwoFactorSetupFinalCompleted
        )
      }
    })
  }
}
