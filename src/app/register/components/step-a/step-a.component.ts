import { Component } from '@angular/core'

import { BaseStep } from '../BaseStep'

@Component({
  selector: 'app-step-a',
  templateUrl: './step-a.component.html',
  styleUrls: ['./step-a.component.scss'],
  preserveWhitespaces: true,
})
export class StepAComponent extends BaseStep {
  constructor() {
    super()
  }
}
