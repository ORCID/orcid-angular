import { Component, Input } from '@angular/core'

import { BaseStepDirective } from '../BaseStep'
import { ReactivationLocal } from '../../../types/reactivation.local'

@Component({
  selector: 'app-step-b',
  templateUrl: './step-b.component.html',
  styleUrls: ['./step-b.component.scss'],
})
export class StepBComponent extends BaseStepDirective {
  @Input() personalData
  @Input() reactivation: ReactivationLocal

  constructor() {
    super()
  }
}
