import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  firstFormGroup: FormGroup
  secondFormGroup: FormGroup
  isLinear = true

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    })
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    })
  }
}
