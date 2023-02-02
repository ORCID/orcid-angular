import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  UntypedFormControl,
  UntypedFormGroup,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { RegisterService } from 'src/app/core/register/register.service'
import { OrcidValidators } from 'src/app/validators'

import { BaseForm } from '../BaseForm'
import { first } from 'rxjs/operators'
import { ReactivationService } from '../../../core/reactivation/reactivation.service'
import { ReactivationLocal } from '../../../types/reactivation.local'

@Component({
  selector: 'app-form-personal',
  templateUrl: './form-personal.component.html',
  styleUrls: ['./form-personal.component.scss'],
  preserveWhitespaces: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormPersonalComponent),
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => FormPersonalComponent),
      multi: true,
    },
  ],
})
export class FormPersonalComponent
  extends BaseForm
  implements OnInit, AfterViewInit
{
  @Input() reactivation: ReactivationLocal
  @ViewChild('firstInput') firstInput: ElementRef
  labelInfoAboutName = $localize`:@@register.ariaLabelInfo:info about names`
  labelClose = $localize`:@@register.ariaLabelClose:close`
  constructor(
    private _register: RegisterService,
    private _reactivationService: ReactivationService
  ) {
    super()
  }

  emails: UntypedFormGroup = new UntypedFormGroup({})
  additionalEmails: UntypedFormGroup = new UntypedFormGroup({
    '0': new UntypedFormControl('', {
      validators: [OrcidValidators.email],
    }),
  })

  ngOnInit() {
    this.emails = new UntypedFormGroup(
      {
        email: new UntypedFormControl('', {
          validators: [Validators.required, OrcidValidators.email],
          asyncValidators: this._register.backendValueValidate('email'),
        }),
        additionalEmails: this.additionalEmails,
      },
      {
        validators: [
          OrcidValidators.matchValues('email', 'confirmEmail', false),
          this.allEmailsAreUnique(),
        ],
        asyncValidators: [
          this._register.backendAdditionalEmailsValidate(
            this.reactivation?.isReactivation
          ),
        ],
        updateOn: 'change',
      }
    )

    if (!this.reactivation?.isReactivation) {
      this.emails.addControl(
        'confirmEmail',
        new UntypedFormControl('', {
          validators: [Validators.required, OrcidValidators.email],
        })
      )
    }

    this.form = new UntypedFormGroup({
      givenNames: new UntypedFormControl('', {
        validators: [Validators.required, OrcidValidators.illegalName],
        asyncValidators: this._register.backendValueValidate('givenNames'),
      }),
      familyNames: new UntypedFormControl('', {
        validators: [OrcidValidators.illegalName],
      }),
      emails: this.emails,
    })

    if (this.reactivation?.isReactivation) {
      this._reactivationService
        .getReactivationData(this.reactivation.reactivationCode)
        .pipe(first())
        .subscribe((reactivation) => {
          this.emails.patchValue({
            email: reactivation.email,
          })
          this.emails.controls['email'].disable()
        })
    }
  }

  ngAfterViewInit(): void {
    // Timeout used to get focus on the first input after the first step loads
    setTimeout(() => {
      this.firstInput.nativeElement.focus()
    }, 100)
  }

  allEmailsAreUnique(): ValidatorFn {
    return (formGroup: UntypedFormGroup) => {
      let hasError = false
      const registerForm =
        this._register.formGroupToEmailRegisterForm(formGroup)

      const error = { backendErrors: { additionalEmails: {} } }

      Object.keys(registerForm.emailsAdditional).forEach((key, i) => {
        const additionalEmail = registerForm.emailsAdditional[key]
        if (!error.backendErrors.additionalEmails[additionalEmail.value]) {
          error.backendErrors.additionalEmails[additionalEmail.value] = []
        }
        const additionalEmailsErrors = error.backendErrors.additionalEmails
        if (
          registerForm.email &&
          additionalEmail.value === registerForm.email.value
        ) {
          hasError = true
          additionalEmailsErrors[additionalEmail.value] = [
            'additionalEmailCantBePrimaryEmail',
          ]
        } else {
          Object.keys(registerForm.emailsAdditional).forEach(
            (elementKey, i2) => {
              const element = registerForm.emailsAdditional[elementKey]
              if (i !== i2 && additionalEmail.value === element.value) {
                hasError = true
                additionalEmailsErrors[additionalEmail.value] = [
                  'duplicatedAdditionalEmail',
                ]
              }
            }
          )
        }
      })

      if (hasError) {
        return error
      } else {
        return null
      }
    }
  }

  // OVERWRITE
  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe((value) => {
      const emailsForm = this._register.formGroupToEmailRegisterForm(
        this.form.controls['emails'] as UntypedFormGroup
      )
      const namesForm =
        this._register.formGroupToNamesRegisterForm(this.form) || {}

      fn({ ...emailsForm, ...namesForm })
    })
  }
}
