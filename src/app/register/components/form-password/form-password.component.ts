import {
  Component,
  OnInit,
  forwardRef,
  ViewChild,
  TemplateRef,
} from '@angular/core'
import { BaseForm } from '../BaseForm'
import {
  FormGroup,
  FormControl,
  Validators,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms'
import { OrcidValidators } from 'src/app/validators'
import { RegisterService } from 'src/app/core/register/register.service'
import { HAS_NUMBER, HAS_LETTER_OR_SYMBOL } from 'src/app/constants'

@Component({
  selector: 'app-form-password',
  templateUrl: './form-password.component.html',
  styleUrls: ['./form-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormPasswordComponent),
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => FormPasswordComponent),
      multi: true,
    },
  ],
})
export class FormPasswordComponent extends BaseForm implements OnInit {
  hasNumberPatter = HAS_NUMBER
  hasLetterOrSymbolPatter = HAS_LETTER_OR_SYMBOL
  constructor(private _register: RegisterService) {
    super()
  }
  ngOnInit() {
    this.form = new FormGroup(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(this.hasNumberPatter),
            Validators.pattern(this.hasLetterOrSymbolPatter),
          ],
          asyncValidators: [this._register.backendValueValidate('password')],
        }),
        passwordConfirm: new FormControl('', Validators.required),
      },
      {
        validators: OrcidValidators.matchValues('password', 'passwordConfirm'),
        asyncValidators: this._register.backendPasswordValidate(),
      }
    )
    this.form.statusChanges.subscribe(value => {
      console.log('PASSWORD ERROR: ', this.form.controls['password'])
    })
  }
}
