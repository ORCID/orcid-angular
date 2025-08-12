import { Component, Input } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'
import { RegisterStateService } from '../../register-state.service'
import { RegisterObservabilityService } from '../../register-observability.service'

@Component({
  selector: 'app-step-d',
  templateUrl: './step-d.component.html',
  styleUrls: [
    './step-d.component.scss',
    '../register.style.scss',
    '../register.scss-theme.scss',
  ],
  standalone: false,
})
export class StepDComponent extends BaseStepDirective {
  @Input() loading
  @Input() reactivation: ReactivationLocal

  constructor(
    private _registrationStateService: RegisterStateService,
    private _registerObservabilityService: RegisterObservabilityService
  ) {
    super()
  }
  ngOnInit(): void {}

  nextButton2() {
    this._registrationStateService.registerStepperButtonClicked('d', 'next')
    this._registerObservabilityService.stepDNextButtonClicked(this.formGroup)
  }
  backButton() {
    this._registrationStateService.registerStepperButtonClicked('d', 'back')
  }
}
