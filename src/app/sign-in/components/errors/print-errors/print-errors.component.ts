import { Component, Inject, Input, OnInit } from '@angular/core'
import { WINDOW } from '../../../../cdk/window'

@Component({
  selector: 'app-print-errors',
  templateUrl: './print-errors.component.html',
  styleUrls: ['./print-errors.component.scss'],
})
export class PrintErrorsComponent implements OnInit {
  @Input() badCredentials: boolean
  @Input() showDeprecatedError: boolean
  @Input() showUnclaimedError: boolean
  @Input() showInvalidUser: boolean
  @Input() orcidPrimaryDeprecated: string
  @Input() email: string

  constructor(@Inject(WINDOW) private window: Window) {}

  ngOnInit() {}

  resendClaim() {
    this.navigateTo(`resend-claim?email=` + encodeURIComponent(this.email))
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
