import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { BaseStep } from '../BaseStep'

@Component({
  selector: 'app-step-c',
  templateUrl: './step-c.component.html',
  styleUrls: ['./step-c.component.scss'],
})
export class StepCComponent extends BaseStep implements OnInit {
  constructor(private _formBuilder: FormBuilder) {
    super()
  }
  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      visibility: [''],
      terms: [''],
    })
  }
}
