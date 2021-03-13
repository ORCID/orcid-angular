import { Component, Input } from '@angular/core'

import { BaseStepDirective } from '../BaseStep'

@Component({
  selector: 'app-step-c',
  templateUrl: './step-c.component.html',
  styleUrls: ['./step-c.component.scss'],
})
export class StepCComponent extends BaseStepDirective {
  @Input() loading
  constructor() {
    super()
  }
}
