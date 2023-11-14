import { Component, Input } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'

@Component({
  selector: 'app-step-b-notifications',
  templateUrl: './step-b-notifications.component.html',
  styleUrls: [
    './step-b-notifications.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
})
export class StepBNotificationsComponent extends BaseStepDirective {
  @Input() personalData
  @Input() reactivation: ReactivationLocal

  constructor() {
    super()
  }
}
