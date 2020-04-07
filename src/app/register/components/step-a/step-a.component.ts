import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { BaseStep } from '../BaseStep'

@Component({
  selector: 'app-step-a',
  templateUrl: './step-a.component.html',
  styleUrls: ['./step-a.component.scss'],
})
export class StepAComponent extends BaseStep implements OnInit {
  constructor(private _formBuilder: FormBuilder) {
    super()
  }
  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      personal: [''],
    })
  }
}
