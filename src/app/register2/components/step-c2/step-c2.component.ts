import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'
import { FormBuilder, FormGroup } from '@angular/forms'
import { RegisterStateService } from '../../register-state.service'
import { RegisterObservabilityService } from '../../register-observability.service'

@Component({
  selector: 'app-step-c2',
  templateUrl: './step-c2.component.html',
  styleUrls: [
    './step-c2.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
})
export class StepC2Component extends BaseStepDirective implements OnInit {
  @Input() loading
  @Input() reactivation: ReactivationLocal
  nextButtonWasClicked: boolean
  @Output() formGroupStepC2OptionalChange = new EventEmitter<boolean>()

  constructor(
    private _registrationStateService: RegisterStateService,
    private _registerObservabilityService: RegisterObservabilityService
  ) {
    super()
  }
  ngOnInit(): void {
  }

  optionalNextStep() {
    this.formGroupStepC2OptionalChange.emit(true)
    this._registrationStateService.registerStepperButtonClicked('c2', 'skip')
  }

  nextButton2() {
    this.formGroupStepC2OptionalChange.emit(false)
    this._registrationStateService.registerStepperButtonClicked('c2', 'next')
  }

  backButton() {
    this._registrationStateService.registerStepperButtonClicked('c2', 'back')
  }
}
