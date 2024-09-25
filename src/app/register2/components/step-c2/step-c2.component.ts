import { Component, EventEmitter, Input, Output } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'
import { FormBuilder, FormGroup } from '@angular/forms'
import { CustomEventService } from 'src/app/core/observability-events/observability-events.service'
import { RegisterStateService } from '../../register-state.service'

@Component({
  selector: 'app-step-c2',
  templateUrl: './step-c2.component.html',
  styleUrls: [
    './step-c2.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
})
export class StepC2Component extends BaseStepDirective {
  @Input() loading
  @Input() reactivation: ReactivationLocal
  nextButtonWasClicked: boolean
  @Output() formGroupStepC2OptionalChange = new EventEmitter<boolean>()

  constructor(
    private _formBuilder: FormBuilder,
    private _observability: CustomEventService,
    private _registerStateService: RegisterStateService
  ) {
    super()
  }

  optionalNextStep() {

    this.formGroupStepC2OptionalChange.emit(true)
    this._registerStateService.registerStepperButtonClicked('c2', 'skip')
  }

  nextButton2() {
  
    this.formGroupStepC2OptionalChange.emit(false)
    this._registerStateService.registerStepperButtonClicked('c2', 'next')
  }

  backButton() {
    this._registerStateService.registerStepperButtonClicked('c2', 'back')
  }
}
