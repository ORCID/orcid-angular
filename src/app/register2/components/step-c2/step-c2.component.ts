import { Component, EventEmitter, Input, Output } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'
import { FormBuilder, FormGroup } from '@angular/forms'

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

  constructor(private _formBuilder: FormBuilder) {
    super()
  }

  optionalNextStep() {
    console.log(this.formGroup.value)
    this.formGroup.setValue({
      affiliations: {
        organization: '',
        departmentName: '',
        roleTitle: '',
        startDateGroup: {
          startDateMonth: '',
          startDateYear: '',
        },
      },
    })
    console.log(this.formGroup.value)

    this.formGroupStepC2OptionalChange.emit(true)
    this.nextButtonWasClicked = true
  }

  requiredNextStep() {
    this.formGroupStepC2OptionalChange.emit(false)
    this.nextButtonWasClicked = true
  }
}
