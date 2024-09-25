import { Component, Input } from '@angular/core'

import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'
import { CustomEventService } from 'src/app/core/observability-events/observability-events.service'
import { RegisterStateService } from '../../register-state.service'

@Component({
  selector: 'app-step-b',
  templateUrl: './step-b.component.html',
  styleUrls: [
    './step-b.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
})
export class StepBComponent extends BaseStepDirective {
  @Input() personalData
  @Input() reactivation: ReactivationLocal

  constructor(
    private _observability: CustomEventService,
    private _registerStateService: RegisterStateService
  ) {
    _observability.recordEvent('orcid_registration', 'step-b-loaded')
    super()
  }

  nextButtonWasClicked = false

  nextButton2() {
    this._registerStateService.registerStepperButtonClicked('b', 'next');
  }
  backButton() {
    this._registerStateService.registerStepperButtonClicked('b', 'back');
  }
}
