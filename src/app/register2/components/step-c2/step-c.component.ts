import { Component, EventEmitter, Input, Output } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'
import { FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-step-c2',
  templateUrl: './step-c.component.html',
  styleUrls: [
    './step-c.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
})
export class StepC2Component extends BaseStepDirective {
  @Input() loading
  @Input() reactivation: ReactivationLocal
  nextButtonWasClicked: boolean
  @Output() formGroupStepC2OptionalChange = new EventEmitter<boolean>()

  constructor() {
    super()
  }
  nextButton() {
    // this.formGroup.controls.personal.markAsTouched()
  }
  optionalNextStep() {
    this.formGroupStepC2OptionalChange.emit(true)
    this.nextButtonWasClicked = true
  }

  requiredNextStep() {
    this.formGroupStepC2OptionalChange.emit(false)
    this.nextButtonWasClicked = true
  }
}
