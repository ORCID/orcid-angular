import { Component, OnInit, forwardRef } from '@angular/core'
import {
  FormGroup,
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms'
import { BaseForm } from '../BaseForm'

@Component({
  selector: 'app-form-additional-emails',
  templateUrl: './form-additional-emails.component.html',
  styleUrls: ['./form-additional-emails.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormAdditionalEmailsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormAdditionalEmailsComponent),
      multi: true,
    },
  ],
})
export class FormAdditionalEmailsComponent extends BaseForm implements OnInit {
  addAdditionalEmail(): void {
    this.form.addControl(
      Object.keys(this.form.controls).length.toString(),
      new FormControl('')
    )
  }

  ngOnInit() {
    this.form = new FormGroup({})
  }
}
