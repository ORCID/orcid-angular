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
  FormControl,
  FormGroupDirective,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgForm,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { Register2Service } from 'src/app/core/register2/register2.service'
import { OrcidValidators } from 'src/app/validators'

import { debounce, debounceTime, filter, first, startWith, switchMap } from 'rxjs/operators'
import { ReactivationService } from '../../../core/reactivation/reactivation.service'
import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseForm } from '../BaseForm'
import { ErrorStateMatcher } from '@angular/material/core'
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    // !((this.emails.hasError('backendError', 'email') && !nextButtonWasClicked))
    console.log(control)
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-form-personal',
  templateUrl: './form-personal.component.html',
  styleUrls: ['./form-personal.component.scss', '../register2.style.scss', '../register2.scss-theme.scss'],
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
  implements OnInit, AfterViewInit {
  matcher = new MyErrorStateMatcher;
  @Input() nextButtonWasClicked: boolean
  @Input() reactivation: ReactivationLocal
  @ViewChild('firstInput') firstInput: ElementRef
  labelInfoAboutName = $localize`:@@register.ariaLabelInfo:info about names`
  labelClose = $localize`:@@register.ariaLabelClose:close`
  labelConfirmEmail = $localize`:@@register.confirmEmail:Confirm primary email`
  labelNameYouMostCommonly = $localize`:@@register.labelNameYouMostMost:The name you most commonly go by`
  labelFamilyNamePlaceholder = $localize`:@@register.familyNamePlaceholder:Your family name or surname
  `
  professionalEmail: boolean
  personalEmail: boolean
  constructor(
    private _register: Register2Service,
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

    this.emails.controls['email'].valueChanges.pipe(debounceTime(1000),filter( () =>
      !this.emails.controls['email'].errors
    ), switchMap(
      (value) => {
        const emailDomain = value.split('@')[1]
        return this._register.getEmailCategory(emailDomain)
      }
    )).subscribe(value => {
      console.log(value)
      this.professionalEmail = value.category === 'PROFESSIONAL'
      this.personalEmail = value.category === 'PERSONAL'

    })



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
    }), 100
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

  get emailFormTouched() {
    // console.log((this.form.controls?.emails as any)?.email)
    return ((this.form.controls.emails as any).controls?.email as any)?.touched
  }

  get emailConfirmationFormTouched() {
    // console.log((this.form.controls?.emails as any)?.email)
    return ((this.form.controls.emails as any).controls?.confirmEmail as any)?.touched
  }
}
