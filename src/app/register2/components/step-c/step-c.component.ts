import { Component, Input } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'

@Component({
  selector: 'app-step-c',
  templateUrl: './step-c.component.html',
  styleUrls: [
    './step-c.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
})
export class StepCComponent extends BaseStepDirective {
  @Input() loading
  @Input() reactivation: ReactivationLocal

  constructor() {
    super()
  }
}
