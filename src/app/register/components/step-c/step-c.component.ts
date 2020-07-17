import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms'
import { BaseStep } from '../BaseStep'

@Component({
  selector: 'app-step-c',
  templateUrl: './step-c.component.html',
  styleUrls: ['./step-c.component.scss'],
})
export class StepCComponent extends BaseStep {
  @Input() loading
  constructor() {
    super()
  }
}
