import { Component, Input } from '@angular/core'

import { BaseStepDirective } from '../BaseStep'
import { ReactivationLocal } from '../../../types/reactivation.local'

@Component({
  selector: 'app-step-c',
  templateUrl: './step-c.component.html',
  styleUrls: ['./step-c.component.scss'],
})
export class StepCComponent extends BaseStepDirective {
  @Input() loading
  @Input() reactivation: ReactivationLocal

  constructor() {
    super()
  }
}
