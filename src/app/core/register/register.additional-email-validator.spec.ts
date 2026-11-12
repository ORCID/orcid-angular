import { UntypedFormControl } from '@angular/forms'
import { of } from 'rxjs'
import { OrcidValidators } from 'src/app/validators'
import { RegisterBackendValidatorMixin } from './register.backend-validators'
import { RegisterFormAdapterMixin } from './register.form-adapter'
import { UntypedFormGroup } from '@angular/forms'
import { FormPersonalComponent } from 'src/app/register/components/form-personal/form-personal.component'
import { FormPersonalAdditionalEmailsComponent } from 'src/app/register/components/form-personal-additional-emails/form-personal-additional-emails.component'

class Base {
  _http: any
  _errorHandler: any
  formGroupToEmailRegisterForm: any
  formGroupToPasswordRegisterForm: any
  formGroupToFullRegistrationForm: any
}

describe('registration additional email validation', () => {
  it('checks a normalized hidden-character address for duplicates and recovers after editing', () => {
    const service = new (RegisterBackendValidatorMixin(Base))()
    const validate = spyOn(service, 'validateRegisterValue').and.returnValue(
      of({
        email: {
          value: 'user@example.org',
          errors: ['orcid.frontend.verify.duplicate_email'],
        },
      })
    )
    const control = new UntypedFormControl('', {
      validators: [OrcidValidators.additionalEmail],
      asyncValidators: [service.backendAdditionalEmailValueValidate()],
    })
    control.setValue('user\u200b@example.org')
    expect(validate).toHaveBeenCalledWith('email', {
      email: { value: 'user@example.org' },
    })
    expect(control.errors).toEqual({
      backendError: ['orcid.frontend.verify.duplicate_email'],
    })
    validate.and.returnValue(
      of({ email: { value: 'other@example.org', errors: [] } })
    )
    control.setValue('other\u200b@example.org')
    expect(control.errors).toEqual({ email: true })
    control.setValue('other@example.org')
    expect(control.valid).toBeTrue()
  })

  it('detects normalized duplicates against primary and additional emails', () => {
    const adapter = new (RegisterFormAdapterMixin(class {}))()
    const component = Object.create(FormPersonalComponent.prototype)
    component._register = adapter
    const additional = new UntypedFormControl('USER\u200b@example.org')
    const form = new UntypedFormGroup({
      email: new UntypedFormControl('user@example.org'),
      additionalEmails: new UntypedFormGroup({ '0': additional }),
    })
    form.setValidators(component.allEmailsAreUnique())
    form.updateValueAndValidity()
    const view = Object.create(FormPersonalAdditionalEmailsComponent.prototype)
    expect(view.getBackendErrorsForAdditionalEmail(additional)).toEqual([
      'additionalEmailCantBePrimaryEmail',
    ])
    form.get('email').setValue('other@example.org')
    ;(form.get('additionalEmails') as UntypedFormGroup).addControl(
      '1',
      new UntypedFormControl('user@example.org')
    )
    expect(view.getBackendErrorsForAdditionalEmail(additional)).toEqual([
      'duplicatedAdditionalEmail',
    ])
  })

  it('exposes control-level duplicate feedback and rejects malformed normalized values', () => {
    const view = Object.create(FormPersonalAdditionalEmailsComponent.prototype)
    const control = new UntypedFormControl('user\u200b@example.org')
    control.setErrors({
      backendError: ['orcid.frontend.verify.duplicate_email'],
    })
    expect(view.getBackendErrorsForAdditionalEmail(control)).toEqual([
      'orcid.frontend.verify.duplicate_email',
    ])
    expect(
      OrcidValidators.additionalEmail(new UntypedFormControl('\u200b'))
    ).toEqual({ email: true })
    expect(
      OrcidValidators.additionalEmail(new UntypedFormControl('bad\u200b'))
    ).toEqual({ email: true })
  })
})
