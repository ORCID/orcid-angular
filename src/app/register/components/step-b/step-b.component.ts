import { Component, Input } from '@angular/core'

import { BaseStep } from '../BaseStep'

@Component({
  selector: 'app-step-b',
  templateUrl: './step-b.component.html',
  styleUrls: ['./step-b.component.scss'],
})
export class StepBComponent extends BaseStep {
  @Input() personalData
  constructor() {
    super()
  }
}
