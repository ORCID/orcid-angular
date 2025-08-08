import { Component, Input, OnInit } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'
import { RegisterStateService } from '../../register-state.service'
import { RegisterObservabilityService } from '../../register-observability.service'

@Component({
    selector: 'app-step-c',
    templateUrl: './step-c.component.html',
    styleUrls: [
        './step-c.component.scss',
        '../register.style.scss',
        '../register.scss-theme.scss',
    ],
    standalone: false
})
export class StepCComponent extends BaseStepDirective implements OnInit {
  @Input() loading
  @Input() reactivation: ReactivationLocal

  constructor(private _registrationStateService: RegisterStateService) {
    super()
  }
  ngOnInit(): void {}

  nextButton2() {
    this._registrationStateService.registerStepperButtonClicked('c', 'next')
  }
  backButton() {
    this._registrationStateService.registerStepperButtonClicked('c', 'back')
  }
}
