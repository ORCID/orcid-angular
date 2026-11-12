import { UntypedFormControl, UntypedFormGroup } from '@angular/forms'
import { of } from 'rxjs'
import { OrcidValidators } from './validators'

describe('OrcidValidators.email', () => {
  it('rejects invisible formatting and control characters in email addresses', () => {
    for (const value of [
      '\u200buser@example.org',
      'user\u200d@example.org',
      'user@example.\u2060org',
      'user@example.org\u0000',
    ]) {
      expect(OrcidValidators.email(new UntypedFormControl(value))).toEqual({
        email: true,
      })
    }
  })

  it('keeps ordinary and internationalized addresses valid and empty optional values valid', () => {
    for (const value of ['', 'user@example.org', 'josé@example.org']) {
      expect(OrcidValidators.email(new UntypedFormControl(value))).toBeNull()
    }
  })

  it('blocks a hidden-character secondary email until corrected', () => {
    const backendValidation = jasmine.createSpy().and.returnValue(of(null))
    const secondary = new UntypedFormControl('', {
      validators: [OrcidValidators.email],
      asyncValidators: [backendValidation],
    })
    const form = new UntypedFormGroup({ secondary })
    backendValidation.calls.reset()

    secondary.setValue('user\u200b@example.org')
    expect(form.invalid).toBeTrue()
    expect(secondary.hasError('email')).toBeTrue()
    expect(backendValidation).not.toHaveBeenCalled()

    secondary.setValue('other@example.org')
    expect(form.valid).toBeTrue()
    expect(backendValidation).toHaveBeenCalled()
  })
})
