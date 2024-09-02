import { Component, Input } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'

@Component({
  selector: 'app-step-b',
  templateUrl: './step-b.component.html',
  styleUrls: [
    './step-b.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
})
export class StepBComponent extends BaseStepDirective {
  @Input() personalData
  @Input() reactivation: ReactivationLocal

  nextButtonWasClicked = false

  constructor() {
    super()
  }
}
