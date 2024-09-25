import { Component, Input, OnInit } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'
import { RegisterStateService } from '../../register-state.service'
import { RegisterObservabilityService } from '../../register-observability.service'

@Component({
  selector: 'app-step-b',
  templateUrl: './step-b.component.html',
  styleUrls: [
    './step-b.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
})
export class StepBComponent extends BaseStepDirective implements OnInit {
  @Input() personalData
  @Input() reactivation: ReactivationLocal

  constructor(
    private _registerStateService: RegisterStateService,
    private _registerObservabilityService: RegisterObservabilityService
  ) {
    super()
  }
  ngOnInit(): void {
  }

  nextButtonWasClicked = false

  nextButton2() {
    this._registerStateService.registerStepperButtonClicked('b', 'next');
  }
  backButton() {
    this._registerStateService.registerStepperButtonClicked('b', 'back');
  }
}
