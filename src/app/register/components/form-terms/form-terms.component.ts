import { Component, OnInit, forwardRef } from '@angular/core'
import {
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validators,
} from '@angular/forms'
import { BaseForm } from '../BaseForm'

@Component({
  selector: 'app-form-terms',
  templateUrl: './form-terms.component.html',
  styleUrls: ['./form-terms.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTermsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormTermsComponent),
      multi: true,
    },
  ],
})
export class FormTermsComponent extends BaseForm implements OnInit {
  ngOnInit() {
    this.form = new FormGroup({
      termsOfUse: new FormControl('', Validators.requiredTrue),
    })
  }
}
