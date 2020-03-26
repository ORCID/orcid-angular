import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { BaseStep } from '../BaseStep'

@Component({
  selector: 'app-step-b',
  templateUrl: './step-b.component.html',
  styleUrls: ['./step-b.component.scss'],
})
export class StepBComponent extends BaseStep implements OnInit {
  constructor(private _formBuilder: FormBuilder) {
    super()
  }
  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      password: [''],
      notifications: [''],
    })
  }
}
