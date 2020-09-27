import { Component, Input } from '@angular/core'

import { BaseStepDirective } from '../BaseStep'

@Component({
  selector: 'app-step-b',
  templateUrl: './step-b.component.html',
  styleUrls: ['./step-b.component.scss'],
})
export class StepBComponent extends BaseStepDirective {
  @Input() personalData
  constructor() {
    super()
  }
}
