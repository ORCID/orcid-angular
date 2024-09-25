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
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
})
export class StepDComponent extends BaseStepDirective {
  @Input() loading
  @Input() reactivation: ReactivationLocal

  nextButtonWasClicked = false

  constructor(
    private _registrationStateService: RegisterStateService,
    private _registerObservabilityService: RegisterObservabilityService
  ) {
    super()
  }
  ngOnInit(): void {
    this._registerObservabilityService.stepLoaded('d')
  }

  nextButton2() {
    this._registrationStateService.registerStepperButtonClicked('d', 'next')
    this._registerObservabilityService.stepDNextButtonClicked(this.formGroup)
  }
  backButton() {
    this._registrationStateService.registerStepperButtonClicked('d', 'back')
  }
}
