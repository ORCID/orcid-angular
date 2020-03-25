import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  FormGroupStepA: FormGroup = new FormGroup({})
  FormGroupStepB: FormGroup = new FormGroup({})
  FormGroupStepC: FormGroup = new FormGroup({})
  isLinear = true
  ngOnInit() {}
}
