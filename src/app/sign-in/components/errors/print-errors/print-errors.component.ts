import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { WINDOW } from '../../../../cdk/window'
import { isValidOrcidFormat } from 'src/app/constants'

@Component({
  selector: 'app-print-errors',
  templateUrl: './print-errors.component.html',
  styleUrls: [
    './print-errors.component.scss',
    '../../sign-in.style.scss',
    '../../sign-in.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class PrintErrorsComponent implements OnInit {
  @Input() badCredentials: boolean
  @Input() showDeprecatedError: boolean
  @Input() showDeactivatedError: boolean
  @Input() showUnclaimedError: boolean
  @Input() showInvalidUser: boolean
  @Input() orcidPrimaryDeprecated: string
  @Input() email: string

  @Output() signInActiveAccount = new EventEmitter<void>()
  @Output() deactivatedAccount = new EventEmitter<void>()
  @Output() unclaimedAccount = new EventEmitter<void>()

  get isEmail() {
    return !isValidOrcidFormat(this.email)
  }

  constructor(@Inject(WINDOW) private window: Window) {}

  ngOnInit() {}

  resendClaim() {
    this.navigateTo(`resend-claim?email=` + encodeURIComponent(this.email))
  }

  unclaimed() {
    this.unclaimedAccount.emit()
  }

  deactivated() {
    this.deactivatedAccount.emit()
  }

  deprecatedAccount() {
    this.signInActiveAccount.emit()
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
