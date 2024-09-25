import { Component, Input } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'
import { CustomEventService } from 'src/app/core/observability-events/observability-events.service'
import { RegisterStateService } from '../../register-state.service'

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

  constructor(private _registrationStateService: RegisterStateService) {
    super()
  }

  nextButton2() {
    this._registrationStateService.registerStepperButtonClicked('c', 'next')
  }
  backButton() {
    this._registrationStateService.registerStepperButtonClicked('c', 'back')
  }
}
