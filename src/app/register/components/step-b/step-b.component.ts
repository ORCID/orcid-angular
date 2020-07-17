import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { BaseStep } from '../BaseStep'
import { RegisterForm } from 'src/app/types/register.endpoint'

@Component({
  selector: 'app-step-b',
  templateUrl: './step-b.component.html',
  styleUrls: ['./step-b.component.scss'],
})
export class StepBComponent extends BaseStep {
  @Input() personalData
  constructor() {
    super()
  }
}
