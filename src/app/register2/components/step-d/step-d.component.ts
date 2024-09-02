import { Component, Input } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'

@Component({
  selector: 'app-step-d',
  templateUrl: './step-d.component.html',
  styleUrls: [
    './step-d.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
})
export class StepDComponent extends BaseStepDirective {
  @Input() loading
  @Input() reactivation: ReactivationLocal

  nextButtonWasClicked = false

  constructor() {
    super()
  }
}
