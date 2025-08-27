import { Component, Inject, Input, OnInit } from '@angular/core'
import { ApplicationRoutes } from '../../../constants'
import { WINDOW } from '../../../cdk/window'
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms'

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

  tooltipClipboard = $localize`:@@account.clipboard:Backup codes have been copied to the clipboard`

  constructor(@Inject(WINDOW) private window: Window) {}

  ngOnInit(): void {
    this.twoFactorForm = new UntypedFormGroup({
      backupCodes: new UntypedFormControl(
        { value: this.backupCodes, disabled: true },
        []
      ),
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
  }
}
