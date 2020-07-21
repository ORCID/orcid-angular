import { Component, Input } from '@angular/core'

import { BaseStep } from '../BaseStep'

@Component({
  selector: 'app-step-c',
  templateUrl: './step-c.component.html',
  styleUrls: ['./step-c.component.scss'],
})
export class StepCComponent extends BaseStep {
  @Input() loading
  constructor() {
    super()
  }
}
